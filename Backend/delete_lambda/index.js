const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { noteId } = event;
    console.log('Deleting note:', noteId);
    const s3Params = {
        Bucket: "serverlessactivity1",
        Key: `notes/${noteId}.txt`,
    };

    const deleteItemParams = {
        TableName: "note_table",
        Key: { noteId: noteId },
        ReturnValues: 'ALL_OLD',
    };

    const deletedNoteParams = {
        TableName: "delete_table",
        Item: {
            noteId: noteId,
            timestamp: new Date().toISOString(),
        },
    };

    try {
        console.log('Deleting note from DynamoDB:', deleteItemParams);
        const data = await dynamoDb.delete(deleteItemParams).promise();
        console.log('Deleted note:', data);
        await s3.deleteObject(s3Params).promise();
        await dynamoDb.put(deletedNoteParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note deleted successfully!', data }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
