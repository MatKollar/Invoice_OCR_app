import { useContext, useState } from "react";
import { Typography } from "@mui/material";
import { BarLoader } from "react-spinners";
import ButtonContained from "../StyledComponents/ButtonContained";
import OCRContext from "../../context/ocr-context";
import { useStyles } from "./styles";
import { COLORS } from "../../styles/constants";
const cv = window.cv;

const UploadCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [isLoading, setIsLoading] = useState(false);

  const PDFJS = require("pdfjs-dist/webpack");

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertPdfToImages = async (file) => {
    let image;
    const data = await readFileData(file);
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4.8 });
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.width = "100%";
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    image = canvas.toDataURL("image/png", 1.0);
    canvas.remove();
    return image;
  };

  const loadImage = () => {
    const img = new Image();
    img.onload = () => {
      const mat = cv.imread(img);
      cv.imshow("output", mat);
      mat.delete();
    };
    return img;
  };

  const saveImage = (file) => {
    ocrCtx.setOriginalImage(file);
    ocrCtx.setActualImage(file);
  };

  const handleImageUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    ocrCtx.setFile(file);
    if (file.type === "application/pdf") {
      const image = convertPdfToImages(file);
      image.then(async (image) => {
        const img = loadImage();
        img.src = image;
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        let fileImage = new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        saveImage(fileImage);
        setIsLoading(false);
      });
    } else {
      const img = loadImage();
      img.src = URL.createObjectURL(file);
      saveImage(file);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Upload Document
        </Typography>
        <div className={classes.input}>
          <input
            type="file"
            onChange={(e) => handleImageUpload(e)}
            className={classes.fileInput}
          />
        </div>
        {isLoading && (
          <div className={classes.loader}>
            <BarLoader color={COLORS.PRIMARY} width={150} />
          </div>
        )}
        <ButtonContained
          style={{
            margin: "20px",
            padding: "5px 35px",
          }}
          onClick={() => ocrCtx.setActivePage(1)}
        >
          NEXT
        </ButtonContained>
      </div>
    </>
  );
};

export default UploadCard;
