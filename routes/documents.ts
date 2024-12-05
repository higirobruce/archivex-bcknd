import { toDateStamp } from "https://deno.land/x/aws_sign_v4@1.0.2/mod.ts";
import { Hono } from "jsr:@hono/hono";
import * as Minio from "npm:minio@8.0.2";
const document = new Hono();

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "RZLhXZaHuaN5qqhf2ZuT", // Deno.env.get("ACCESS_KEY"),
  secretKey: "yOP4zVD4UPgDYKcfu6Nnrt6leramkDtoO4oJ1Xfs", // Deno.env.get("SECRET_KEY"),
});

document.get("/", (c) => {
  return c.html("Document List", { status: 200 });
});

document.get("/:name", (c) => {
  return c.html(`Document ${c.req.param("name")}`, { status: 200 });
});

document.post("/", async (c) => {
  const TMP_DIR = "./tmp";
  // Ensure the tmp folder exists
  await Deno.mkdir(TMP_DIR, { recursive: true });

  const files = await c.req.parseBody();
  const file: File = files["file"] as File;
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);


  try {
    // Generate file path in tmp folder
    const filePath = `${TMP_DIR}/${file.name}`;

    // performOCR(filePath);

    // Write file to tmp directory
    await Deno.writeFile(filePath, uint8Array);
    await minioClient.fPutObject(
      "bucket2",
      file.name.split(".")[0] +
        toDateStamp(new Date()) +
        "." +
        file.name.split(".")[1],
      filePath,
      {
        "Content-Type": file.type,
      },
      async (err: object, objInfo: object) => {
        if (err !== null) {
          console.log(err);
          return c.html(`Error ${err}`, { status: 500 });
        }

        console.log(JSON.stringify(objInfo));
        await Deno.remove(TMP_DIR, { recursive: true });
      }
    );
    return c.html("The document is being uploaded!", {
      status: 200,
    });
  } catch (error) {
    return c.html(`Error ${error}`, { status: 500 });
  }
});


document.put("/:id", (c) => {
  return c.html(`Editing Document ${c.req.param("id")}`, { status: 200 });
});

export default document;
