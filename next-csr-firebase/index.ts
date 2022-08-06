// next exportしたあと、このファイルを実行する
// outディレクトリ配下のhtmlファイルのパスから、firebase.jsonのリライトの設定を動的に生成する
import { globby, fs } from "zx";

const htmlFilePaths = globby.globbySync("**/*.html", { cwd: "./out" });

console.log(htmlFilePaths);

const baseFirebaseJson = {
  hosting: {
    public: "out",
    ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
    // ここでリライトの設定を行う。例えば、/rooms/*にアクセスされたときに、/rooms/[id].htmlを表示するようにする
    rewrites: htmlFilePaths
      .map((htmlFilePath) => {
        const destination = "/" + htmlFilePath;
        const source = destination
          .replace(/\[.+?\](\.html)?/g, "*") // e.g. /rooms/[id].html -> /rooms/*, /rooms/[id]/question.html -> /rooms/*/question.html
          .replace("index.html", "") // e.g. /rooms/index.html -> /rooms
          .replace(".html", "") // e.g. /rooms/*/question.html -> /rooms/*/question
          .replace(/(.+)\/$/, "$1"); // e.g. 末尾のスラッシュを削除 /rooms/ -> /rooms
        return { source, destination };
      })
      .concat({ source: "**", destination: "/404.html" }),
  },
};

fs.writeJSONSync("./firebase.json", baseFirebaseJson, { spaces: 2 });
