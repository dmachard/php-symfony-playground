<?php
namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Dto\MeOutput;
use App\State\MeProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/v1/me',
            output: MeOutput::class,
            provider: MeProvider::class,
            security: "is_granted('ROLE_USER')"
        )
    ]
)]
class Me {}
