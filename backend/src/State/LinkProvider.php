<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Link;
use App\Repository\LinkRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

class LinkProvider implements ProviderInterface
{
    public function __construct(
        private LinkRepository $linkRepository,
        private UserRepository $userRepository,
        private Security $security
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $currentUser = $this->security->getUser();

        if (!$currentUser) {
            return [];
        }

        // If the user has the ROLE_ADMIN, return all links
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return $this->linkRepository->findAll();
        }

        // Else return only the links of the current user
        $user = $this->userRepository->findOneBy([
            'email' => $currentUser->getUserIdentifier()
        ]);

        if (!$user) {
            return [];
        }

        return $this->linkRepository->findBy(['user' => $user]);
    }
}