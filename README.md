<!-- ![GitHub release (latest by date)](https://img.shields.io/github/v/release/danielrataj/knarozkam) -->

<img src="/app/public/logo/favicon_1024_1024.png" alt="logo" width="150" height="150" align="right"
 />

# knarozkam


## Prerequisities

You need

-   [Docker](https://www.docker.com/) to run all required images.
-   [Docker Compose](https://docs.docker.com/compose/) to run all containers at once.

## Installation

The easiest way is to run this project with the `docker-compose.yml` file.

```bash
docker network create -d bridge knarozkam_app-tier

docker-compose -p knarozkam down && docker-compose -p knarozkam up -d
```

Now you can access the monitor right from URL <http://localhost:8080>. Default user/password based on the example is "knarozkam:knarozkam".

## Ready to contribute?

You can always:

-   raise a [new issue](https://github.com/danielrataj/knarozkam/issues) or
    Consider implementing some change on your own and then creating a [pull request](https://github.com/danielrataj/knarozkam/pulls).

We appreciate any help or opinion.

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

This project is licensed under the **[MIT license](http://opensource.org/licenses/mit-license.php)** - see the [LICENSE.md](/LICENSE.md) file for details.
