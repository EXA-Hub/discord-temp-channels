{ pkgs }: {
    deps = [
        pkgs.yarn
        pkgs.nodejs-16_x
        pkgs.nodePackages_latest.npm
        pkgs.nodePackages_latest.nodemon
        pkgs.nodePackages_latest.typescript
    ];
}