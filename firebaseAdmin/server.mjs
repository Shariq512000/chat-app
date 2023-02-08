import admin from 'firebase-admin'

var serviceAccount = {
    "type": "service_account",
    "project_id": "post-storage-3d871",
    "private_key_id": "e3ff2d43adf89df3784c14af0558ac72a3447163",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCma0gS7FD0ZWOO\n72VpXU0hdfr5/6MkgRD7njO81AZ9uLe2c9PUAKM16HUKU48xJIVzqQaj3O1B8jyT\nXOlmYIlsl5y53KbCsx8q0912GFqEzugveMfhjfJXJXdCrT6mgDph2VIo1ZS9Z3yN\nd5v5Rxypn038F3SXLqaNTglXuSqgSffu3E+3i7FpFiIjEn/BzHTO5qOqN/k7Aft1\nOlRmMKo7BnC8T4N6C58i9Ugu+os1LGmUYS5Uf4rUX8J7xoFeEqxqS6g8ZNcF+OMH\nHmzvTSFYodNNIdvC/mGHBUtJgLfcpFfFMnaus1YaTDZk6i7LUZHtXN3IOPeKvZ2P\nrZOaymFTAgMBAAECggEAOBK5zDZ36IEpFIYxQ1k+neGk2Qt7qtcaI83gXOWL8lyE\n+iL44tv8IjPbC8mv270Ugi4XoKrV/nxiULzjn60zYLWNB0sDnWLBQ6rzWdFG3qzg\nqu4lWyh62UY0cvDwxSU7hrC08DFW1qLB4uDEWy/MxpJ4slIs5KvBTqdWmoo3hJ4c\nYYO9kykL/O1rkCdMIcId/zKG0wkKMhHZtNSYL2xBMAA8QVsX+GZ/rbSYXIxMdBWI\ny+Os6MVJeQytkhLjrgT8V/eW1LS3viGGNeixOEQDc+UIq6/k57yqDRA8QLxnRCsR\n04HdeVz/AGV9SFqhJXNUfVVIfVkIu2jiDW5g2RChcQKBgQDbmJFw90FRhHC0ngCb\nEQcwTOIpXRGH0HwlNQ6H3uKtZ9Oqd4680azbOQWtwo2vF0gVeaI5DtLAPvA1jYib\nef/WjWhYhCTx35rY/8lq0ao+gObmadEcDKHXnE93pLhjlq0YPwqdwJ90ma86wE+b\nAQTSnRg3qY7Ym2zoACgxjVc8tQKBgQDCAfB0PvkprxHLf7QxtAOGktg87qrkYlZm\nfBqs+MX4Oywj5kywovZbP5suXLJ/+E6atqUqaPZV4haCBjv59a/867RrYKgukjEx\nYeMmgdVL4LKYS8NgBticciNd5HHMQXyphm/95d0/7JAeSP7pBaylhc7XYiRnjJeq\nYZV+iCJy5wKBgD9Qrh60K9ElLpnlNKeBMWFryYnDm9pc8m6H7bifOxxkY1MzRaSL\nkBtlRY3kGpXxUIdgmrV44KstenT2afzqICnse7mJ4F0c67jFh32VFlEPOYQV3oUH\n32IbX45PoBqWxzHGe3kgoNkttqhp6on2sT1IrkLeUKGDrtL1uKEQ76ZBAoGAYW55\n5NdvaIi8hheXVlLSZnY+1LMD7fiY7ZUsDGxPd++3pjvVjev5jy/tbiYtmukICNjr\nL9ZQyCboKNqaqljBzmJNVJPRQro2rFc9rawMg7PP3X5HG2W0yTTlIBVHNU46HiUe\n/0K+j4jtg9gi9MHdx67ghviJ0dsgm/ewDUCvFEcCgYAp7rlZDPxI29Gcadj9PTBf\nKCpci5tZtVbXltftYl4j5YiJc7WQjgf4WkB6Uwl7Dy4/IhuK/iMk1b6aQPAqo3mh\nKGMUBAssG7qB11IvidIlcGjjul3Z24Tf+tDYgDcQt8DteKVLba3cawaIyVtspcS0\nOS8levQo60W7kAXlQ6oCwg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-tfbre@post-storage-3d871.iam.gserviceaccount.com",
    "client_id": "100267659489164594214",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tfbre%40post-storage-3d871.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://post-storage-3d871.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://post-storage-3d871.appspot.com");

export default bucket;