<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User;
use App\Entity\Link;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {

        // Add 3 users with 3 links each
        for ($i = 1; $i <= 3; $i++) {
            $user = new User();
            $user->setEmail("user{$i}@example.com");
            $user->setRoles(['ROLE_USER']);
            $user->setCreatedAt(new \DateTime());
            $manager->persist($user);

            // each user has 3 links
            for ($j = 1; $j <= 3; $j++) {
                $link = new Link();
                $link->setTitle("Link $j for User $i");
                $link->setUser($user);
                $link->setUrl("https://example.com/user{$i}/link{$j}");
                $link->setDescription("This is link $j for user $i.");
                $manager->persist($link);
            }
        }

        $manager->flush();
    }
}
