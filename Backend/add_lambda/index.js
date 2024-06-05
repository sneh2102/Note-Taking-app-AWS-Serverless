const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { noteId, content } = event;
    const s3Params = {
        Bucket: "serverlessactivity1",
        Key: `notes/${noteId}.txt`,
        Body: content,
    };

    const dynamoDbParams = {
        TableName: "note_table",
        Item: {
            noteId: noteId,
            timestamp: new Date().toISOString(),
            s3Key: `notes/${noteId}.txt`,
        },
    };

    try {
        await s3.putObject(s3Params).promise();
        await dynamoDb.put(dynamoDbParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note added successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
