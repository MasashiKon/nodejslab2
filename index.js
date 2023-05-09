const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

server.on('request', (req, res) => {
    if(req.url === '/') {
        console.log('on /');
        res.write(`
            <h1>Hello Node!</h1>
            <a href="http://localhost:8000/read-message">read-message</a>
            <a href="http://localhost:8000/write-message">write-message</a>
        `);
        return res.end()
    }

    if(req.url === '/read-message') {
        console.log("on /read-message");
        fs.readFile(path.join(__dirname, "message.txt"), 'utf8', (err, data) => {
            if(err) return err;
            res.write(`
                <h1>Your data</1>
                <p>${data}</p>
            `);
            return res.end();
        })
    }

    if(req.url === '/write-message' && req.method === 'GET') {
        console.log("on /write-message");
        fs.readFile(path.join(__dirname, "message.txt"), 'utf8', (err, data) => {
            if(err) return err;
            res.setHeader('Content-Type', 'text/html')
            res.write(`
                <form method="post">
                    <input type="text" id="data" name="data" value=${data}>
                <button>submit</button>
                </form>
            `);
            return res.end();
        })
    }

    if(req.url === '/write-message' && req.method === 'POST') {
        const body = []

        req.on('data', (chunk) => {
            body.push(chunk)
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log('>>> ',parsedBody)

            //pretend to save to db (saving to a local file)
            const message = parsedBody.split("=")[1]

            fs.writeFile('message.txt', message, (err) => {
                if(err) throw err
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
        })
    }
})


server.on('listening', () => {
    console.log("Server is listening...");
})

server.listen(8000);