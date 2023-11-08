import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenHeight,
  screenWidth,
} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {BottomSheet} from '@rneui/themed';
import {Menu} from 'react-native-material-menu';
import MyStatusBar from '../../components/myStatusBar';

const carBrandsList = [
  'Toyota',
  'Maruti Suzuki',
  'Hyundai',
  'Mahindra',
  'Tata Motors',
];

const carModelsList = [
  'Toyota Innova',
  'Maruti Wagon R',
  'Hyundai Creta',
  'Mahindra Xuv500',
  'Hyundai I10',
  'Renault Kwid',
  'Hyundai I20',
];

const EditProfileScreen = ({navigation}) => {
  const [name, setName] = useState('Cameron Williamson');
  const [email, setEmail] = useState('cameronwilliamson@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 1236457890');
  const [password, setPassword] = useState('123456789');
  const [showSheet, setShowSheet] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('GJ 5 AB 1258');
  const [showCarBrands, setShowCarBrands] = useState(false);
  const [selectedCarBrand, setSelectedCarBrand] = useState(carBrandsList[0]);
  const [showCarModels, setShowCarModels] = useState(false);
  const [selectedCarModel, setSelectedCarModel] = useState(carModelsList[0]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <MyStatusBar />
      <View style={{flex: 1}}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          {personalInfo()}
          {carInfo()}
          {documentInfo()}
        </ScrollView>
      </View>
      {saveButton()}
      {editProfilePicSheet()}
    </View>
  );

  function documentInfo() {
    return (
      <View style={styles.documentInfoWrapStyle}>
        <Text style={styles.carAndDocumentInfoTitleStyle}>Document</Text>
        {govermentIdInfo()}
        {licenseInfo()}
      </View>
    );
  }

  function licenseInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.grayColor15SemiBold}}>License</Text>
          <Text style={{...Fonts.primaryColor14Bold}}>Upload</Text>
        </View>
        <View style={styles.govermentIdAndLicenseWrapStyle}>
          <MaterialCommunityIcons
            name="shield-check"
            size={18}
            color={Colors.lightGrayColor}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding,
              flex: 1,
              ...Fonts.blackColor16Bold,
            }}>
            Not yet uploaded
          </Text>
        </View>
        {divider()}
      </View>
    );
  }

  function govermentIdInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Government ID</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowSheet(true);
          }}
          style={styles.govermentIdAndLicenseWrapStyle}>
          <MaterialCommunityIcons
            name="shield-check"
            size={18}
            color={Colors.primaryColor}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding,
              flex: 1,
              ...Fonts.blackColor16Bold,
            }}>
            Voted.jpg
          </Text>
        </TouchableOpacity>
        {divider()}
      </View>
    );
  }

  function carInfo() {
    return (
      <View style={styles.carInfoWrapStyle}>
        <Text style={styles.carAndDocumentInfoTitleStyle}>Car Info</Text>
        {carBrandInfo()}
        {carModelInfo()}
        {vehicleNumberInfo()}
      </View>
    );
  }

  function carModelInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding - 6.0,
            ...Fonts.grayColor15SemiBold,
          }}>
          Car Model
        </Text>
        <Menu
          visible={showCarModels}
          style={styles.menuStyle}
          anchor={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowCarModels(true);
              }}
              style={styles.carModelAndBrandWrapStyle}>
              <Text style={{...Fonts.blackColor16Bold}}>
                {selectedCarModel}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => {
            setShowCarModels(false);
          }}>
          <ScrollView
            contentContainerStyle={{paddingTop: Sizes.fixPadding * 2.0}}>
            {carModelsList.map((item, index) => (
              <Text
                key={`${index}`}
                onPress={() => {
                  setShowCarModels(false);
                  setSelectedCarModel(item);
                }}
                style={{
                  ...Fonts.blackColor16Bold,
                  marginBottom: Sizes.fixPadding,
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}>
                {item}
              </Text>
            ))}
          </ScrollView>
        </Menu>
        {divider()}
      </View>
    );
  }

  function carBrandInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding - 6.0,
            ...Fonts.grayColor15SemiBold,
          }}>
          Car Brand
        </Text>
        <Menu
          visible={showCarBrands}
          style={styles.menuStyle}
          anchor={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowCarBrands(true);
              }}
              style={styles.carModelAndBrandWrapStyle}>
              <Text style={{...Fonts.blackColor16Bold}}>
                {selectedCarBrand}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => {
            setShowCarBrands(false);
          }}>
          <ScrollView
            contentContainerStyle={{paddingTop: Sizes.fixPadding * 2.0}}>
            {carBrandsList.map((item, index) => (
              <Text
                key={`${index}`}
                onPress={() => {
                  setShowCarBrands(false);
                  setSelectedCarBrand(item);
                }}
                style={{
                  ...Fonts.blackColor16Bold,
                  marginBottom: Sizes.fixPadding,
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}>
                {item}
              </Text>
            ))}
          </ScrollView>
        </Menu>
        {divider()}
      </View>
    );
  }

  function vehicleNumberInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Vehicle Number</Text>
        <TextInput
          value={vehicleNumber}
          onChangeText={value => setVehicleNumber(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
        {divider()}
      </View>
    );
  }

  function personalInfo() {
    return (
      <View style={styles.personalInfoWrapStyle}>
        <View style={styles.profilePicOuterWrapStyle}>{profilePic()}</View>
        {fullNameInfo()}
        {emailInfo()}
        {phoneNumberInfo()}
        {passwordInfo()}
      </View>
    );
  }

  function editProfilePicSheet() {
    return (
      <BottomSheet
        isVisible={showSheet}
        onBackdropPress={() => setShowSheet(false)}>
        <View style={styles.sheetWrapStyle}>
          <View style={styles.sheetIndicatorStyle} />
          <Text
            style={{
              marginBottom: Sizes.fixPadding * 2.0,
              textAlign: 'center',
              ...Fonts.blackColor18Bold,
            }}>
            Choose Option
          </Text>
          {profilePicOptionSort({
            icon: 'photo-camera',
            option: 'Use Camera',
            onPress: () => {
              setShowSheet(false);
            },
          })}
          {profilePicOptionSort({
            icon: 'photo',
            option: 'Upload from Gallery',
            onPress: () => {
              setShowSheet(false);
            },
          })}
          {profilePicOptionSort({
            icon: 'delete',
            option: 'Remove Photo',
            onPress: () => {
              setShowSheet(false);
            },
          })}
        </View>
      </BottomSheet>
    );
  }

  function profilePicOptionSort({icon, option, onPress}) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MaterialIcons name={icon} size={20} color={Colors.lightGrayColor} />
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            flex: 1,
            ...Fonts.grayColor15SemiBold,
          }}>
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.pop();
        }}
        style={styles.buttonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Save</Text>
      </TouchableOpacity>
    );
  }

  function passwordInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 4.0,
        }}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Password</Text>
        <TextInput
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          secureTextEntry
          clearTextOnFocus={false}
        />
        {divider()}
      </View>
    );
  }

  function phoneNumberInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={value => setPhoneNumber(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="phone-pad"
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
        <Text style={{...Fonts.grayColor15SemiBold}}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
        {divider()}
      </View>
    );
  }

  function fullNameInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <Text style={{...Fonts.grayColor15SemiBold}}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={value => setName(value)}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
        {divider()}
      </View>
    );
  }

  function divider() {
    return <View style={{backgroundColor: Colors.shadowColor, height: 1.0}} />;
  }

  function profilePic() {
    return (
      <View style={styles.profilePicWrapStyle}>
        <Image
          source={require('../../assets/images/users/user1.png')}
          style={{
            width: screenWidth / 4.8,
            height: screenWidth / 4.8,
            borderRadius: screenWidth / 4.8 / 2.0,
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowSheet(true);
          }}
          style={styles.editIconWrapStyle}>
          <MaterialIcons
            name="camera-alt"
            size={screenWidth / 29.0}
            color={Colors.primaryColor}
          />
        </TouchableOpacity>
      </View>
    );
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
          Edit Profile
        </Text>
      </View>
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  editIconWrapStyle: {
    backgroundColor: Colors.whiteColor,
    width: screenWidth / 16.0,
    height: screenWidth / 16.0,
    borderRadius: screenWidth / 16.0 / 2.0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0.0,
    right: 0.0,
    elevation: 3.0,
    ...commonStyles.shadow,
  },
  profilePicWrapStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
  sheetIndicatorStyle: {
    width: 50,
    height: 5.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignSelf: 'center',
    marginVertical: Sizes.fixPadding * 2.0,
  },
  sheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.5,
    borderTopRightRadius: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Platform.OS == 'ios' ? Sizes.fixPadding : 0,
  },
  personalInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: screenWidth / 4.8 / 2.0 + Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
  },
  profilePicOuterWrapStyle: {
    alignItems: 'center',
    marginTop: -(screenWidth / 4.8) / 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 2.0,
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
  },
  carAndDocumentInfoTitleStyle: {
    marginTop: Sizes.fixPadding - 22.0,
    textAlign: 'center',
    ...Fonts.blackColor18Bold,
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    paddingHorizontal: Sizes.fixPadding + 2.0,
  },
  carInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    elevation: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    margin: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  carModelAndBrandWrapStyle: {
    marginBottom: Sizes.fixPadding - 4.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuStyle: {
    width: '80%',
    paddingBottom: Sizes.fixPadding - 5.0,
    alignSelf: 'center',
    maxHeight: screenHeight - 150,
  },
  govermentIdAndLicenseWrapStyle: {
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding - 4.0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    elevation: 1.0,
    margin: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
});
