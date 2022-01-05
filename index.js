const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const { json } = require('express');

AWS.config.update({
    region: 'us-east-1',
});

const array = [];
const sns = new AWS.SNS();
const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:953508242615:notificacionescoder001';

app.use(express.json());

app.get('/', (req, res) => {
    res.send('api rest AWS TEST');
})

app.post('/api/users', (req, res) => {
    console.log(req.body);
    let {username, password} = req.body;
    let obj = {
        id:Math.random(),
        username,
        password
    }
    array.push(obj);
    let user =JSON.stringify(obj);

    return sns.publish({
        Message: `Nuevo usuario registrado ${user}`,
        TopicArn: SNS_TOPIC_ARN

    }).promise()
    .then(data => {
        const body = {
            Operation: 'save',
            Message: 'success',
            Item: req.body
        }
            
        res.json(data);
    })
    .catch(err => {
        res.status(500).end();
    });

})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is running on port 3000');
});