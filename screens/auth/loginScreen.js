import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import {Colors, Fonts, Sizes, screenHeight} from '../../constants/styles';
import {useFocusEffect} from '@react-navigation/native';
import MyStatusBar from '../../components/myStatusBar';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [backClickCount, setBackClickCount] = useState(0);

  const { signIn, errorMessage, removeError } = useContext(AuthContext)

  const backAction = () => {
    if (Platform.OS === 'ios') {
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      navigation.addListener('gestureEnd', backAction);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
        navigation.removeListener('gestureEnd', backAction);
      };
    }, [backAction]),
  );

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }
    Alert.alert('Login Incorrecto', errorMessage, [ {
      text: 'Aceptar',
      onPress: () => {
        removeError();
      }
    }]);

  }, [errorMessage])
  

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }


  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <MyStatusBar />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{justifyContent: 'flex-end', flexGrow: 1}}>
        </ScrollView>
          {loginImage()}
          {welcomeInfo()}
          {loginForm()}
          {loginButton()}
          {registerButton()}
      </View>
      {exitInfo()}
    </View>
  );

  function loginButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          signIn({ email, password })
          //navigation.push('Home');
        }}
        style={styles.buttonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Iniciar Sesión</Text>
      </TouchableOpacity>
    );
  }

  function registerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push('Register');
        }}
        style={styles.buttonRegisterStyle}>
        <Text style={{...Fonts.blackColor15Bold}}>Aun no tienes cuenta? Clic Aqui</Text>
      </TouchableOpacity>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{...Fonts.whiteColor15SemiBold}}>
          Presiona 2 veces para salir
        </Text>
      </View>
    ) : null;
  }

  function loginForm() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}>
          <Text style={{...Fonts.grayColor15SemiBold}}>Correo</Text>
          <TextInput
            value={email}
            onChangeText={value => setEmail(value)}
            style={styles.textFieldStyle}
            cursorColor={Colors.primaryColor}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder='micorreo@gmail.com'
          />
          <Text style={{...Fonts.grayColor15SemiBold}}>Clave</Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={value => setPassword(value)}
            style={styles.textFieldStyle}
            cursorColor={Colors.primaryColor}
            placeholder='**********'
          />
        
      </View>
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 4.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <Text style={{...Fonts.blackColor20Bold}}>Bienvenido a MiGas Driver App</Text>
        <Text
          style={{marginTop: Sizes.fixPadding, ...Fonts.grayColor14SemiBold}}>
          Ingresa tu correo y clave para comenzar
        </Text>
        
      </View>
    );
  }

  function loginImage() {
    return (
      <Image
        source={require('../../assets/images/app_icon.png')}
        style={{
          width: 'auto',
          height: screenHeight / 3.0,
          resizeMode: 'contain',
        }}
      />
    );
  }
};

export default LoginScreen;

const styles = StyleSheet.create({
  phoneInputStyle: {
    flex: 1,
    ...Fonts.blackColor15Bold,
    borderBottomColor: Colors.shadowColor,
    borderBottomWidth: 1.0,
    padding:0
  },
  textFieldStyle: {
    ...Fonts.blackColor16Bold,
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding - 4.0,
    padding: 1,
    borderColor: 'lightgrey',
    borderBottomWidth: 1, // Puedes ajustar el ancho según tus preferencias
  },
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 3.0,
    marginHorizontal: Sizes.fixPadding * 6.0,
    marginVertical: Sizes.fixPadding * 0.25,
  },
  buttonRegisterStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
