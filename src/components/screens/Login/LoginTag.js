import React from 'react';
import {Textview, Container, ImageView} from '../../default/index';
import AppLogo from '../../../assets/kharcha.png';
import {WELCOME, LOGIN_HEADER} from '../../../res/strings';
import {ImageBackground} from 'react-native';

export const Logintag = () => {
  const {appLogo, loginTagContainer} = styles;
  return (
    <Container /*ContainerStyle={loginTagContainer}*/>
      <ImageView imageStyle={appLogo} imgSource={AppLogo} />
    </Container>
  );
};

const styles = {
  loginTagContainer: {},
  appLogo: {
    height: 380,
    width: '100%',
  },
  headingOne: {
    marginTop: 25,
    fontSize: 24,
    color: 'black',
  },
  headingTwo: {
    fontSize: 16,
    color: 'black',
  },
};
