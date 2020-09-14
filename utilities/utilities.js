
// lib
const semver = require('semver');

const extractLatestVersion = function(versions) {
    let latestVersion = {}

    versions.forEach(current => {
        const [majorVersion] = current.version.split('.')

        // init the major version if not exist
        if (!latestVersion[majorVersion]) {
            return latestVersion[majorVersion] = current
        }

        // compare and replace
        const isCurrentVersionGreater = semver.gt(
            current.version,
            latestVersion[majorVersion].version,
        );
        if (isCurrentVersionGreater) {
            return latestVersion[majorVersion] = current
        }
    })

    return latestVersion
}

module.exports = {
    extractLatestVersion
}
