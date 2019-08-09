import React, { useState, useEffect } from "react";
import { SkyLightStateless } from "react-skylight";
import "rodal/lib/rodal.css";
import {
  Container,
  Title,
  ButtonContainer,
  HeaderContainer,
  ButtonFiller,
  dialogStyles
} from "./styles";
import ActionButton from "../../components/ActionButton";
import Train from "./components/Train";
import SizePicker from "./components/SizePicker";
import AddCartForm from "./components/AddCartForm";
import { addCart, setupCartUpdateListener } from "../../helpers";
import { loadAudio } from "../../constants";

const audio = new Audio(loadAudio);

const MainScreen = () => {
  const [carts, setCarts] = useState([]);
  const [cartSize, setCartSize] = useState("M");
  const [modalVisible, setModalVisible] = useState(false);
  const [formUploadProgress, setFormUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    audio.pause();
    audio.currentTime = 0;
  };

  const onButtonPress = () => {
    audio.play();
    showModal();
  };

  const onFormProgress = snapshot => {
    const percentageComplete =
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFormUploadProgress(percentageComplete);
  };

  const onFormComplete = () => {
    hideModal();
    setUploading(false);
    setFormUploadProgress(0);
  };

  const onAddCartFormSubmit = ({ name, color, file }) => {
    setUploading(true);
    addCart({
      name,
      color,
      file,
      onUploadProgress: onFormProgress,
      onComplete: onFormComplete
    });
  };

  useEffect(() => {
    setupCartUpdateListener(carts => {
      setCarts(carts);
    });
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <Title>ALL ABOARD THE HUMMUS TRAIN</Title>
        <SizePicker setCartSize={setCartSize} selectedSize={cartSize} />
      </HeaderContainer>
      <Train carts={carts} cartSize={cartSize} />
      <ButtonFiller />
      <ButtonContainer>
        <ActionButton onClick={onButtonPress}>
          Board the Hummus Train!
        </ActionButton>
      </ButtonContainer>
      <SkyLightStateless
        dialogStyles={dialogStyles}
        hideOnOverlayClicked
        isVisible={modalVisible}
        onOverlayClicked={hideModal}
        onCloseClicked={hideModal}
        closeOnEsc
      >
        {// manually unmount the form to reset state on close
        modalVisible && (
          <AddCartForm
            onSubmit={onAddCartFormSubmit}
            progress={formUploadProgress}
            uploading={uploading}
          />
        )}
      </SkyLightStateless>
    </Container>
  );
};

export default MainScreen;
