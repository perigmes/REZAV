import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { setInfoObject } from "../../features/demande/demandeSlice";
import {
  selectObjInfos,
  selectUSerInfos,
} from "../../features/demande/demandeSelector";
import "../../assets/styles/popup.scss";
import { useState } from "react";
import {
  addObject,
  updateObject,
} from "../../features/demande/reservationsAsyncAction";

const ObjectPopup = ({ addingMode, closeFunction }) => {
  const dispatch = useDispatch();
  const infoObject = useSelector(selectObjInfos);
  const userInfos = useSelector(selectUSerInfos);
  const [infos, setInfos] = useState(
    addingMode
      ? {
          _id: "",
          categorie: "",
          description: "",
          name: "",
          picture: "",
        }
      : infoObject
  );

  const [preview, setPreview] = useState(

    infoObject.picture instanceof File ? null : infoObject.picture // Si c'est une URL, la garder
  );

  const closePopup = () => {
    dispatch(setInfoObject({}));
    closeFunction();
    
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInfos({ ...infos, picture: file });

      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categorie", infos.categorie);
    formData.append("name", infos.name);
    formData.append("description", infos.description);

    if (infos.picture instanceof File) {
      formData.append("picture", infos.picture);
    }
    if(!infos.isLate){
      formData.append("isLate", false);
    }
    console.log(formData);
    addingMode
      ? dispatch(addObject({data: formData}))
      : dispatch(updateObject({ id: infos._id, data: formData }));
    closePopup();
  };

  return (
    <Modal
      className="object-popup"
      onRequestClose={closePopup}
      isOpen={infos  || addingMode}
    >
      <div className="object-popup-content">
        <button onClick={closePopup} className="material-symbols-rounded btnClose">
        close
        </button>
        {userInfos.role === "admin" ? (
          <>
            <form onSubmit={handleSubmit} method="post">
              <div className="formPopup">
                <img
                  src={preview}
                  alt={infos.name}
                  className="imgObject"
                />
                <div className="object-infos">
                  <div className="rezav-input input-txt">
                    <label htmlFor="categorie">Categorie</label>
                    <input
                      id="categorie"
                      name="categorie"
                      value={infos.categorie}
                      onChange={(e) =>{
                        setInfos({ ...infos, categorie: e.currentTarget.value });
                        console.log(infos)}
                      }
                      className="w-100"
                    />
                  </div>

                  <div className="rezav-input input-txt">
                    <label htmlFor="name">Nom</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={infos.name}
                      onChange={(e) =>
                        setInfos({ ...infos, name: e.currentTarget.value })
                      }
                      className="w-100"
                    />
                  </div>

                  <div className="rezav-input input-txt">
                    <label htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      value={infos.description}
                      onChange={(e) =>
                        setInfos({
                          ...infos,
                          description: e.currentTarget.value,
                        })
                      }
                      className="w-100"
                    />
                  </div>
                  <div className="rezav-input input-file">
                    <label
                      htmlFor="picture"
                      className="material-symbols-rounded"
                    >
                      upload_file
                    </label>
                    <p className="label">
                      {infos.picture instanceof File
                        ? infos.picture.name
                        : infos.picture}
                    </p>
                    <p className="restrictions">fichier webp uniquement</p>
                    <input
                      id="picture"
                      type="file"
                      name="picture"
                      accept="image/webp"
                      onChange={handleFileChange}
                      className="fileBtn"
                    />
                  </div>
                </div>
              </div>

              <button
                name="btnFormObject"
                type="submit"
                className="rezav-button-1 btnFormObject"
              >
                {addingMode ? "Ajouter" : "Modifier"}
              </button>
            </form>
          </>
        ) : (
          <div className="formPopup">
            <img
              src={preview}
              alt={infos.name}
              className="imgObject"
            />
            <div className="object-infos">
              <h2 className="objects-filtered-title">{infos.categorie}</h2>
              <p id="name" name="name" className="w-100 text1">
                {infos.name}
              </p>

              <div className="rezav-input input-txt">
                <label htmlFor="description" className="text1">
                  Description
                </label>
                <pre
                  name="description"
                  id="description"
                  className="w-100 text2"
                >
                  {infos.description}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ObjectPopup;

