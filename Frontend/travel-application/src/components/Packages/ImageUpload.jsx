const ImageUpload = ({ images, setImages }) => {

    const handleImageChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        setImages(prev => [...prev, ...selectedFiles]);

    };

    const removeImage = (index) => {

        const updatedImages = [...images];

        updatedImages.splice(index, 1);

        setImages(updatedImages);

    };

    return (

        <div className="card package-card mb-4">

            <div className="card-header">

                <h4 className="mb-0 fw-bold">
                    Package Images
                </h4>

                <small className="text-muted">
                    Upload package gallery images.
                </small>

            </div>

            <div className="card-body">

                <div className="upload-box">

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
                    />

                    <small className="text-muted d-block mt-2">
                        JPG, PNG, JPEG
                    </small>

                </div>

                {

                    images.length > 0 && (

                        <div className="mt-4">

                            <h6 className="fw-bold mb-3">
                                Uploaded Images ({images.length})
                            </h6>

                            {

                                images.map((image, index) => (

                                    <div
                                        key={index}
                                        className="position-relative mb-3"
                                    >

                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt=""
                                            className="img-fluid rounded shadow-sm"
                                            style={{
                                                width: "100%",
                                                height: "180px",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                            onClick={() => removeImage(index)}
                                        >
                                            ✕
                                        </button>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

};

export default ImageUpload;