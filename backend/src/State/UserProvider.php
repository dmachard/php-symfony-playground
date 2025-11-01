<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

class UserProvider implements ProviderInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private Security $security
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // Get the currently authenticated user
        $currentUser = $this->security->getUser();

        if (!$currentUser) {
            return [];
        }

        // if the user has the ROLE_ADMIN, return all users
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return $this->userRepository->findAll();
        }

        //else return only the current user
        $user = $this->userRepository->findOneBy([
            'email' => $currentUser->getUserIdentifier()
        ]);

        return $user ? [$user] : [];
    }
}
