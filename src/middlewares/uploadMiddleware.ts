import multer from "multer";
import path from "path";
import fs from "fs";

// 기본 업로드 경로 및 하위 폴더
const uploadDir = "uploads";
const profileDir = path.join(uploadDir, "profiles");
const itemImageDir = path.join(uploadDir, "item-images");

// 폴더 없으면 생성
[uploadDir, profileDir, itemImageDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 동적 폴더 설정 함수
const getStorage = (dir: string, prefix: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${prefix}_${uniqueSuffix}${ext}`);
    },
  });

// 파일 필터
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("지원하지 않는 파일 형식입니다. JPG, PNG, GIF만 허용"));
};

// 미들웨어 export
export const uploadProfilePhoto = multer({
  storage: getStorage(profileDir, "profile"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("profilePhoto");

export const uploadItemImage = multer({
  storage: getStorage(itemImageDir, "item"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

// 유틸
export const deleteFile = (dir: string, filename: string) => {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

export const getImagePath = (type: "profile" | "item", filename: string) => {
  if (!filename) return null;
  return type === "profile"
    ? `/uploads/profiles/${filename}`
    : `/uploads/item-images/${filename}`;
};
