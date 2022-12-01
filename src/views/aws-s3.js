import { randomId } from "./useful-functions.js";

const s3BucketName = "cranky";
const bucketRegion = "ap-northeast-1";
const IdentityPoolId = "ap-northeast-1:163b7a7c-829e-457f-aed9-e0efac914055";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: s3BucketName },
});

async function addImageToS3(fileInputElement, album) {
  const files = fileInputElement.files;
  if (!files.length) {
    throw new Error("사진 파일을 업로드 해주세요.");
  }

  const file = files[0];
  const fileName = randomId() + "_" + file.name;
  const albumPhotosKey = encodeURIComponent(album) + "/";
  const photoKey = albumPhotosKey + fileName;

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: s3BucketName,
      Key: photoKey,
      Body: file,
    },
  });

  try {
    const uploadedFile = await upload.promise();

    const fileKey = uploadedFile.Key;
    console.log(uploadedFile);
    console.log(
      `AWS S3에 사진이 정상적으로 업로드됐습니다.\n파일 위치: ${fileKey}`
    );
    return fileKey;
  } catch (err) {
    throw new Error(
      `S3에 업로드하는 과정에서 에러가 발생했습니다.\n${err.message}`
    );
  }
}

function getImageUrl(imageKey) {
  const imageUrl = new Promise((resolve) => {
    const params = {
      Bucket: s3BucketName,
      Key: imageKey,
      Expires: 60,
    };

    s3.getSignedUrl("getObject", params, (_, url) => {
      resolve(url);
    });
  });

  return imageUrl;
}

export { addImageToS3, getImageUrl };
