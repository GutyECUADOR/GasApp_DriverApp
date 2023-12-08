import {
  StyleSheet,
  BackHandler,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import RideRequestsScreen from '../rideRequests/rideRequestsScreen';
import MyStatusBar from '../../components/myStatusBar';
import { useLocation } from '../../hooks/useLocation';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({navigation}) => {

  const [pedidos, setPedidos] = useState([])
  const [backClickCount, setBackClickCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const { user } = useContext(AuthContext)
  const { hasLocation, initialPosition, userLocation, getCurrentLocation, followUserLocation, address } = useLocation();
  const mapViewRef = useRef();

  const centerPosition = async () => {
    const { latitude, longitude } = await getCurrentLocation()
    console.log('Centrando posición', latitude, longitude);
    mapViewRef.current?.animateCamera({
      center: {
          latitude,
          longitude,
          zoom:12
      }
    })
  };

  useEffect(() => {
    const subscriber = firestore()
    .collection('pedidos')
    .onSnapshot(querySnapshot => {
      const markers = [];

      querySnapshot.forEach(documentSnapshot => {
        markers.push({
          id: documentSnapshot.id,
          coordinate: {
            latitude: documentSnapshot.get('coordinate').latitude,
            longitude: documentSnapshot.get('coordinate').longitude,
          },
        });
      });

      console.log('Clientes/Pedidos: ', markers);
      setPedidos(markers);
     
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    centerPosition()
    updateStatusDriver();
    followUserLocation();
   return () =>{
    // TODO : Cancelar seguimiento al salir de la app
   }
  }, [])

  useEffect(() => {
    const { latitude, longitude } = userLocation;
    mapViewRef.current?.animateCamera({
      center: {
          latitude,
          longitude,
          zoom:12
      }
    })

    updateLocationDriver()
  }, [userLocation])
  

  const updateStatusDriver = async () => {
    const { latitude, longitude } = userLocation;
    // Obtiene una referencia a la colección
    const coleccion = firestore().collection('distribuidores');
    // Realiza la consulta para buscar documentos que coincidan con el campo y valor especificados
    coleccion.where('id', '==', user.id).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            // doc.data() contiene los datos del documento encontrado
            console.log(doc.data())
            console.log('ID del documento:', doc.id, 'Datos:', doc.data());
            if (doc.data()) {
              const documentoRef = firestore().collection('distribuidores').doc(doc.id);
              // Actualiza los datos del documento
              documentoRef.update({
                isActivo: !isOnline
              })
              setIsOnline(!isOnline);
            }
          });
        }else{
          // Obtiene una referencia a la colección
          const coleccion = firestore().collection('distribuidores');
          // Crea un objeto GeoPoint con latitud y longitud
          const geoPoint = new firestore.GeoPoint(initialPosition.latitude, initialPosition.longitude);
          // Añade un nuevo documento con datos
          coleccion.add({
            id: user.id,
            name: user.name,
            coordinate: geoPoint,
            isActivo: false
          })
        }
      })
      .catch((error) => {
        console.error('Error al buscar documentos:', error);
      });
   
  };

  const updateLocationDriver = async () => {
    if (isOnline == false) {
      // No registrar nueva ubucacion si esta offline
      return;
    }

    const { latitude, longitude } = userLocation;
    // Obtiene una referencia a la colección
    const coleccion = firestore().collection('distribuidores');
    // Realiza la consulta para buscar documentos que coincidan con el campo y valor especificados
    coleccion.where('id', '==', user.id).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            // doc.data() contiene los datos del documento encontrado
            console.log(doc.data())
            console.log('ID del documento:', doc.id, 'Datos:', doc.data());
            if (doc.data()) {
              const documentoRef = firestore().collection('distribuidores').doc(doc.id);
              // Crea un objeto GeoPoint con latitud y longitud
              const geoPoint = new firestore.GeoPoint(latitude, longitude);
              // Actualiza los datos del documento
              documentoRef.update({
                coordinate: geoPoint
              })
            }
          });
        }else{
          // Obtiene una referencia a la colección
          const coleccion = firestore().collection('distribuidores');
          // Crea un objeto GeoPoint con latitud y longitud
          const geoPoint = new firestore.GeoPoint(latitude, longitude);
          // Añade un nuevo documento con datos
          coleccion.add({
            id: user.id,
            name: user.name,
            coordinate: geoPoint,
            isActivo: false
          })
        }
      })
      .catch((error) => {
        console.error('Error al buscar documentos:', error);
      });
   
  };

  
  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction]),
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

 

  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <MyStatusBar />
        <View style={{flex: 1}}>
          {displayMap()}
          {toolBar()}
          {currentLocationIcon()}
        </View>
     
      {exitInfo()}
    </View>
  );

  function goOnlineButton() {
    return isOnline ? null : (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setIsOnline(true);
          setShowMenu(false);
        }}>
        <ImageBackground
          source={require('../../assets/images/icons/circle.png')}
          style={styles.goOnlineButtonBgImageStyle}>
          <Text style={{textAlign: 'center', ...Fonts.whiteColor18ExtraBold}}>
            Poner{`\n`}Online
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  function currentLocationIcon() {
    return (
      <View style={styles.currentLocationIconWrapStyle}>
        <MaterialIcons onPress={centerPosition} name="my-location" size={30} color="black" />
      </View>
    );
  }

  function ridesInfo() {
    return (
      <View style={styles.ridesInfoWrapStyle}>
        <Image
          source={require('../../assets/images/users/user1.png')}
          style={{width: 50.0, height: 50.0, borderRadius: 25.0}}
        />
        <View style={{flex: 1, marginLeft: Sizes.fixPadding + 5.0}}>
          <Text style={{...Fonts.whiteColor13Bold}}>12 Rides | $ 350.50</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 5.0,
              ...Fonts.whiteColor12SemiBold,
            }}>
            Today
          </Text>
        </View>
      </View>
    );
  }

  function toolBar() {
    return (
      <View style={styles.onlineOffLineInfoWithIconsOuterWrapStyle}>
        <View style={styles.currentLocationWithIconWrapStyle}>
          <MaterialIcons
            name="menu"
            size={20}
            color={Colors.blackColor}
            onPress={() => {
              navigation.openDrawer();
            }}
          />
          <View
            style={{
              maxWidth: '80%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowMenu(false);
              }}
              style={styles.rowAlignCenterStyle}>
              <View
                style={{
                  ...styles.onlineOfflineIndicatorStyle,
                  backgroundColor: !isOnline
                    ? Colors.redColor
                    : Colors.primaryColor,
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  textAlign: 'center',
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.blackColor15SemiBold,
                }}>
                {isOnline ? 'Estás Online' : 'Estás Offline'}
              </Text>
            </TouchableOpacity>
            {showMenu ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Cambiar estado activo: Estado: ' + !isOnline)
                  updateStatusDriver();
                  setShowMenu(false);
                }}
                style={{
                  marginTop: Sizes.fixPadding * 2.0,
                  ...styles.rowAlignCenterStyle,
                }}>
                <View
                  style={{
                    ...styles.onlineOfflineIndicatorStyle,
                    backgroundColor: !isOnline
                      ? Colors.primaryColor
                      : Colors.redColor,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'center',
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor15SemiBold,
                  }}>
                  {!isOnline ? 'Estás Online' : 'Estás Offline'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={Colors.primaryColor}
            onPress={() => {
              setShowMenu(!showMenu);
            }}
          />
        </View>
      </View>
    );
  }

  function displayMap() {
    return (
      <View style={{flex: 1}}>
        <MapView
          ref={ (element) => mapViewRef.current = element}
          zoomEnabled={true}
          minZoomLevel={15}
          zoomControlEnabled={true}
          showsUserLocation={true}
          initialRegion={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          style={{height: '100%'}}
          provider={PROVIDER_GOOGLE}
          >
          <Marker coordinate={userLocation}>
            <Image
              source={require('../../assets/images/icons/cab.png')}
              style={{width: 25.0, height: 45.0, resizeMode: 'contain'}}
            />
          </Marker>
        </MapView>
      </View>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{...Fonts.whiteColor15SemiBold}}>
          Presiona nuevamente para salir
        </Text>
      </View>
    ) : null;
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
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
  currentLocationWithIconWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding + 3.0,
    paddingVertical: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    margin: Sizes.fixPadding * 2.0,
    elevation: 2.0,
  },
  currentLocationIconWrapStyle: {
    bottom: 20.0,
    right: 20.0,
    position: 'absolute',
    borderRadius: 20.0,
    width: 40.0,
    height: 40.0,
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineOfflineIndicatorStyle: {
    width: 8.0,
    height: 8.0,
    borderRadius: 4.0,
  },
  ridesInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlackColor,
    borderRadius: Sizes.fixPadding - 5.0,
    position: 'absolute',
    left: 20.0,
    right: 20.0,
    top: 95.0,
    padding: Sizes.fixPadding,
  },
  onlineOffLineInfoWithIconsOuterWrapStyle: {
    position: 'absolute',
    left: 0.0,
    right: 0.0,
    zIndex: 1,
  },
  rowAlignCenterStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goOnlineButtonBgImageStyle: {
    width: 110.0,
    height: 110.0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80.0,
    alignSelf: 'center',
  },
});
