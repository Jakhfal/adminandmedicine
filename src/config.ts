
import path from "path"
//mendefinisikan alamat dari jalan server
const ROOT_DIRECTORY = `${path.join(__dirname, `../`)}`

//dirname : mendapatkan posisi dari folder pada file ini (consfig.ts). -> /src/config.ts
// ":" -> mundur 1 folder ke belakang

export { ROOT_DIRECTORY }