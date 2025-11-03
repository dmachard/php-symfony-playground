<?php
namespace App\Dto;

use App\Entity\Link;

class MeOutput
{
    public int $id;
    public string $email;
    public array $roles;
}
