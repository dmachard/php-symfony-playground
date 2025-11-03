<?php
namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;

class UserDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $currentUser = $this->security->getUser();

        // prevent admins from deleting their own account
        if ($currentUser && $data->getId() === $currentUser->getId()) {
            throw new \RuntimeException("You cannot delete your own account.");
        }

        // proceed with deletion
        $this->em->remove($data);
        $this->em->flush();

        return null;
    }
}
