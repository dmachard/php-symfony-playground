<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class OidcUserProvider implements UserProviderInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        // Search for the user by email
        $user = $this->userRepository->findOneBy(['email' => $identifier]);

        // if the user does not exist, create a new one
        if (!$user) {
            $user = new User();
            $user->setEmail($identifier);
            $user->setRoles(['ROLE_USER']);
            $user->setCreatedAt(new \DateTime());

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        return $user;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Invalid user class "%s".', get_class($user)));
        }

        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }
}
