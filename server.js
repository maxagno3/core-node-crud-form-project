let http = require('http');
let server = http.createServer(handleRequest);
let url = require('url');
let fs = require('fs');
let path = require('path');

function handleRequest(req, res) {

    let store = '';
    let userPath = path.join(__dirname, 'users/');
    let parsedURL = url.parse(req.url, true);

    req.on('data', (chunks) => {
        store += chunks;
    })
    req.on('end', () => {
        let parsedData = JSON.parse(store).username;

        // Create
        if (req.method === 'POST' && parsedURL.pathname === '/users') {
            fs.open(userPath + parsedData + '.json', 'wx', (err, fd) => {
                if (err) {
                    return err;
                } else {
                    fs.writeFile(fd, store, (err) => {
                        if (err) {
                            res.end('Error');
                            return err;
                        } else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    res.end('Error');
                                    return err;
                                } else {
                                    res.end('Created!');
                                }
                            })
                        }
                    })
                }
            })
        } else if (req.method === 'GET' && parsedURL.pathname === '/users') {

            // Read
            fs.open(userPath + parsedData + '.json', 'r', (err, fd) => {
                if (err) {
                    res.end('Error!');
                    return err
                } else {
                    fs.readFile(fd, (err, data) => {
                        if (err) {
                            res.end('error');
                            return err;
                        } else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    res.end(err);
                                    return err;
                                } else {
                                    res.end('Read Successful!');
                                }
                            })
                        }
                    })
                }
            })
        } else if (req.method === 'PUT' && parsedURL.pathname === '/users') {

            // Update
            fs.open(userPath + parsedData + '.json', 'r+', (err, fd) => {
                if (err) {
                    res.end('Error!');
                } else {
                    fs.writeFile(fd, store, (err) => {
                        if (err) {
                            res.end('error');
                            return err;
                        } else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    res.end(end);
                                    return err;
                                } else {
                                    res.end('Open for updating!');
                                }
                            })
                        }
                    })
                }
            })
        } else if (req.method === 'DELETE') {

            // Delete
            fs.unlink(userPath + parsedData + '.json', () => {
                res.end('File Deleted. Yay! Oh no!');
            });
        }
    })
}

server.listen(5000, () => {
    console.log('Server running on port 5000')
})