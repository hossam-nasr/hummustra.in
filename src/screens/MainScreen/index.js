import React, { useState, useEffect } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { Container, Title, ButtonContainer, TrainContainer } from "./styles";
import Train from "./components/Train";
import AddCartButton from "./components/AddCartButton";
import SizePicker from "./components/SizePicker";
import AddCartForm from "./components/AddCartForm";
import { addCart, setupCartUpdateListener } from "../../helpers";
import { loadAudio } from "../../constants";

const audio = new Audio(loadAudio);

const MainScreen = () => {
  const [carts, setCarts] = useState([]);
  const [cartSize, setCartSize] = useState("M");
  const [modalVisible, setModalVisible] = useState(false);

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

  const onAddCartFormSubmit = ({ name, color }) => {
    addCart({ name, color });
    hideModal();
  };

  useEffect(() => {
    // get carts
    setupCartUpdateListener(carts => {
      setCarts(carts);
    });
  }, []);

  return (
    <Container>
      <Title>ALL ABOARD THE HUMMUS TRAIN</Title>
      <SizePicker setCartSize={setCartSize} selectedSize={cartSize} />
      <TrainContainer>
        <Train carts={carts} cartSize={cartSize} />
      </TrainContainer>
      <ButtonContainer>
        <AddCartButton onClick={onButtonPress} />
      </ButtonContainer>
      <Rodal
        width={50}
        height={50}
        measure="%"
        closeOnEsc
        showMask
        visible={modalVisible}
        onClose={hideModal}
      >
        <AddCartForm onSubmit={onAddCartFormSubmit} />
      </Rodal>
    </Container>
  );
};

export default MainScreen;
