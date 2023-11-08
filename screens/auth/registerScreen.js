import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import {Overlay} from '@rneui/themed';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MyStatusBar from '../../components/myStatusBar';
import { AuthContext } from '../../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const { signUp } = useContext(AuthContext)

  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <MyStatusBar />
      <View style={{flex: 1}}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          {fullNameInfo()}
          {emailInfo()}
          {phoneNumberInfo()}
          {passwordInfo()}
        </ScrollView>
      </View>
      {registerButton()}
      {loadingDialog()}
      {successDialog()}
      
    </View>
  );

  function registerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setisLoading(true);
          signUp({ name, phone, email, password })
          /* setTimeout(() => {
            setisLoading(false);
            setisSuccess(true);
            //navigation.push('Login');
          }, 2000); */
        }}
        style={styles.buttonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Registrarme</Text>
      </TouchableOpacity>
    );
  }

  function phoneNumberInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Número de teléfono</Text>
        <TextInput
          value={phone}
          onChangeText={value => setPhone(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          keyboardType="phone-pad"
          placeholder="Ingresa tu número de celular"
          placeholderTextColor={Colors.lightGrayColor}
        />
        {divider()}
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Email</Text>
        <TextInput
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          keyboardType="email-address"
          placeholder="Ingresa tu correo electrónico"
          placeholderTextColor={Colors.lightGrayColor}
        />
        {divider()}
      </View>
    );
  }

  function fullNameInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Nombre Completo</Text>
        <TextInput
          value={name}
          onChangeText={value => setName(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          placeholder="Ingresa tu nombre y apellido"
          placeholderTextColor={Colors.lightGrayColor}
        />
        {divider()}
      </View>
    );
  }

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator
          size={56}
          color={Colors.primaryColor}
          style={{
            alignSelf: 'center',
            transform: [{scale: Platform.OS == 'ios' ? 2 : 1}],
          }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            textAlign: 'center',
            ...Fonts.grayColor14Regular,
          }}>
          Espere por favor...
        </Text>
      </Overlay>
    );
  }

  function successDialog() {
    return (
      <Overlay isVisible={isSuccess} overlayStyle={styles.dialogStyle}>
        <Image
          source={require('../../assets/images/app_icon.png')}
          style={{
            width: 'auto',
            height: 100,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            fontSize: 20,
            marginTop: Sizes.fixPadding * 2.0,
            textAlign: 'center',
            ...Fonts.blackColor14SemiBold,
          }}>
          Registro correcto
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
              navigation.push('Login');
              isSuccess(false);
          }}
          style={styles.buttonStyle}>
          <Text style={{...Fonts.whiteColor18Bold}}>Aceptar</Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  function passwordInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Contraseña</Text>
        <TextInput
          secureTextEntry={true}
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          placeholder="***"
          placeholderTextColor={Colors.lightGrayColor}
        />
        {divider()}
      </View>
    );
  }

  function divider() {
    return <View style={{backgroundColor: Colors.shadowColor, height: 1.0}} />;
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <FontAwesome6
          name="arrow-left"
          size={20}
          color={Colors.blackColor}
          onPress={() => navigation.pop()}
        />
        <Text
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding + 2.0,
            ...Fonts.blackColor20ExtraBold,
          }}>
          Registro de nuevo usuario
        </Text>
      </View>
    );
  }
};

export default RegisterScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    height: 20.0,
    ...Fonts.blackColor16Bold,
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding - 4.0,
    padding: 0,
  },
  buttonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 3.0,
    marginHorizontal: Sizes.fixPadding * 6.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  dialogStyle: {
    width: '80%',
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding + 5.0,
    paddingTop: Sizes.fixPadding * 2.0,
    elevation: 3.0,
  }
});
