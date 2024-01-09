import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes, commonStyles} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MyStatusBar from '../../components/myStatusBar';

const userRidesList = [
  {
    id: '1',
    passengerName: 'Usuario de pruebas',
    date: 'Today',
    time: '01-01-2024',
    amount: 3.50,
    pickupAddress: 'Alemania 899 y Mariana de Jesus',
  },
];

const UserRidesScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <MyStatusBar />
      <View style={{flex: 1}}>
        {header()}
        {userRides()}
      </View>
    </View>
  );

  function userRides() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          //navigation.push('RideDetail');
        }}
        style={styles.ridesInfoWrapStyle}>
        <View style={styles.rideTimeAndAmountWrapStyle}>
          <Image
            source={require('../../assets/images/users/user1.png')}
            style={{width: 55.0, height: 55.0, borderRadius: 27.5}}
          />
          <View style={{flex: 1, marginHorizontal: Sizes.fixPadding}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  marginRight: Sizes.fixPadding,
                  ...Fonts.blackColor16SemiBold,
                }}>
                {item.date} {item.time}
              </Text>
              <Text style={{...Fonts.primaryColor16Bold}}>
                {`$`}
                {item.amount.toFixed(2)}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                marginTop: Sizes.fixPadding - 7.0,
                ...Fonts.grayColor14SemiBold,
              }}>
              {item.passengerName}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 24, alignItems: 'center'}}>
            <View style={styles.currentLocationIconStyle}>
              <View
                style={{
                  width: 7.0,
                  height: 7.0,
                  borderRadius: 3.5,
                  backgroundColor: Colors.blackColor,
                }}
              />
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding + 5.0,
              flex: 1,
              ...Fonts.blackColor15SemiBold,
            }}>
            {item.pickupAddress}
          </Text>
        </View>
       {/*  <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 24.0, alignItems: 'center'}}>
            <Text style={{...Fonts.blackColor8SemiBold, lineHeight: 6}}>
              •{`\n`}•{`\n`}•{`\n`}•{`\n`}•{`\n`}•{`\n`}•
            </Text>
          </View>
          <View style={styles.currentToDropLocationInfoDividerStyle} />
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: -(Sizes.fixPadding - 5.0),
          }}>
          <View style={{width: 24.0, alignItems: 'center'}}>
            <MaterialIcons
              name="location-pin"
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              marginLeft: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor15SemiBold,
            }}>
            {item.dropAddress}
          </Text>
        </View> */}
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={userRidesList}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding,
          paddingBottom: Sizes.fixPadding - 5.0,
        }}
        showsVerticalScrollIndicator={false}
      />
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
          Mis pedidos realizados
        </Text>
      </View>
    );
  }
};

export default UserRidesScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  currentToDropLocationInfoDividerStyle: {
    backgroundColor: Colors.shadowColor,
    height: 1.0,
    flex: 1,
    marginRight: Sizes.fixPadding * 2.5,
    marginLeft: Sizes.fixPadding,
  },
  currentLocationIconStyle: {
    width: 18.0,
    height: 18.0,
    borderRadius: 9.0,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.blackColor,
    borderWidth: 2.0,
  },
  ridesInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    ...commonStyles.shadow,
  },
  rideTimeAndAmountWrapStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
