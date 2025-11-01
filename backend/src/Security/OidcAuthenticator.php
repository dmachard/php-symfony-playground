<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;


class OidcAuthenticator extends AbstractAuthenticator
{
    private string $oidcDomain;
    private string $oidcAudience;
    private HttpClientInterface $httpClient;
    private ?array $cachedKeys = null;
    private LoggerInterface $logger;
    private UserProviderInterface $userProvider;

    public function __construct(HttpClientInterface $httpClient, string $oidcDomain, string $oidcAudience, LoggerInterface $logger, UserProviderInterface $userProvider)
    {
        $this->httpClient = $httpClient;
        $this->oidcDomain = rtrim($oidcDomain, '/');
        $this->oidcAudience = $oidcAudience;
        $this->logger = $logger;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization') 
            && str_starts_with($request->headers->get('Authorization'), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $token = substr($request->headers->get('Authorization'), 7);

        if (empty($token)) {
            throw new AuthenticationException('Token missing');
        }

        try {
            // Retrieve the JWKS from the OIDC provider
            if ($this->cachedKeys === null) {
                $jwksUrl = $this->oidcDomain . '/protocol/openid-connect/certs';
                $response = $this->httpClient->request('GET', $jwksUrl);
                $jwks = $response->toArray();
                $this->cachedKeys = JWK::parseKeySet($jwks);
            }

            // Validate and decode the JWT
            $decoded = JWT::decode($token, $this->cachedKeys);
            $this->logger->info('Token decoded', (array)$decoded);

            // // Check audience
            $audiences = is_array($decoded->aud) ? $decoded->aud : [$decoded->aud];
            if (!in_array($this->oidcAudience, $audiences, true)) {
                $this->logger->warning('Invalid audience', [
                    'expected' => $this->oidcAudience,
                    'got' => $audiences
                ]);
                throw new AuthenticationException('Invalid audience');
            }

            // Extract roles
            $roles = [];
            if (isset($decoded->resource_access->{$this->oidcAudience}->roles)) {
                $roles = $decoded->resource_access->{$this->oidcAudience}->roles;
                // Ensure ROLE_ prefix
                $roles = array_map(function($role) {
                    return str_starts_with($role, 'ROLE_') ? $role : 'ROLE_' . strtoupper($role);
                }, $roles);
            }
            if (empty($roles)) {
                $roles = ['ROLE_USER'];
            }

            // Extract user identifier (e.g., email or sub)
            $userIdentifier = $decoded->email ?? $decoded->sub;

            return new SelfValidatingPassport(
                new UserBadge($userIdentifier, function ($userIdentifier) use ($roles) {
                    // Load user from database ?
                    $user = $this->userProvider->loadUserByIdentifier($userIdentifier);
                    
                    // Update user roles
                    if ($user instanceof \App\Entity\User) {
                        $user->setRoles($roles);
                    }
                    
                    return $user;
                })
            );
        } catch (\Exception $e) {
            throw new AuthenticationException('Invalid token: ' . $e->getMessage());
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();
        $this->logger->info('User authenticated', [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'error' => 'Authentication failed',
            'message' => $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }
}