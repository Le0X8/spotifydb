const https = require('https');

const request = (path, callback, subdomain) => {
    var newsd = subdomain;
    if (!newsd) {newsd = 'open';};
    https.get({host: newsd + '.spotify.com', port: 443, path: path, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0'}}, (r) => {
        var data = ''; r.setEncoding('utf8'); r.on('data', (chnk) => {data += chnk}); r.on('end', _ => {callback(data); return null;}); return null;
    });
    return null;
};

module.exports = {
    track: (id, callback) => {
        request('/embed/track/' + id, data => {
            callback(JSON.parse(Buffer.from(data.split('<script id="initial-state" type="text/plain">')[1].split('</script>')[0], 'base64').toString('utf8'))); return null;
        });
    },
    album: (id, callback) => {
        request('/embed-legacy/album/' + id, data => {
            callback(JSON.parse(Buffer.from(data.split('<script id="resource" type="text/plain">')[1].split('</script>')[0], 'base64').toString('utf8'))); return null;
        });
    },
    artist: (id, callback) => {
        request('/embed-legacy/artist/' + id, data => {
            callback(JSON.parse(Buffer.from(data.split('<script id="resource" type="text/plain">')[1].split('</script>')[0], 'base64').toString('utf8'))); return null;
        });
    },
    playlist: (id, callback) => {
        request('/embed-legacy/playlist/' + id, data => {
            callback(JSON.parse(Buffer.from(data.split('<script id="resource" type="text/plain">')[1].split('</script>')[0], 'base64').toString('utf8'))); return null;
        });
    },
    episode: (id, callback) => {
        request('/embed/episode/' + id, data => {
            callback(JSON.parse(Buffer.from(data.split('<script id="initial-state" type="text/plain">')[1].split('</script>')[0], 'base64').toString('utf8'))); return null;
        });
    },
    episode_url: (id, callback) => { // .url items don't work good for playing/downloading, use .passthroughUrl instead
        request('/soundfinder/v1/unauth/episode/' + id + '/com.widevine.alpha', data => {
            callback(JSON.parse(data)); return null;
        }, 'spclient.wg'); return null;
    }
    // show is missing, because it would return the data from ep. 1 of the podcast :/
};