const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const params = {
        TableName: "note_table",
    };

    try {
        // Fetch all items from DynamoDB
        const data = await dynamoDb.scan(params).promise();
        const notes = data.Items;

        // Fetch content from S3 using the S3 keys
        const s3Promises = notes.map(async (note) => {
            const s3Params = {
                Bucket: "serverlessactivity1",
                Key: note.s3Key,
            };
            const s3Data = await s3.getObject(s3Params).promise();
            return {
                noteId: note.noteId,
                content: s3Data.Body.toString('utf-8'),
                timestamp: note.timestamp,
            };
        });

        // Wait for all S3 fetch promises to complete
        const fullNotes = await Promise.all(s3Promises);

        return {
            statusCode: 200,
            body: JSON.stringify(fullNotes),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
