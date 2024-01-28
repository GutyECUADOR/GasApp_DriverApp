import {
  StyleSheet,
  BackHandler,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import {Colors, Fonts, Sizes, screenHeight, screenWidth, commonStyles} from '../../constants/styles';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import MyStatusBar from '../../components/myStatusBar';
import { AuthContext } from '../../context/AuthContext';

import firestore from '@react-native-firebase/firestore';
import { LocationContext } from '../../context/LocationContext';

const HomeScreen = ({navigation}) => {

  // Constantes
  // Verificar Métodos de pago segun DB
  const paymentmethods = [
    {
      id: '1',
      paymentType: 'cash',
      paymentMethod: 'Efectivo',
    },
    {
      id: '2',
      paymentType: 'other',
      paymentMethod: 'Transferencia Bancaria',
    },
  ];

  const appState = {
    SinPedido: 'SinPedido',
    DeliveryIniciado: 'DeliveryIniciado',
    DeliveryFinalizado: 'DeliveryFinalizado'
  };

  const [pedidos, setPedidos] = useState([])
  const [backClickCount, setBackClickCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showNuevoPedido, setShowNuevoPedido] = useState(false);  // Flag para mostrar Sheet del pedido
  const [nuevoPedido, setNuevoPedido] = useState({});
  const { user } = useContext(AuthContext)

  const { locationState, setHasPedidoActivo, setLocation, setDeliveryLocation, getAddress, getCurrentLocation, followUserLocation } = useContext(LocationContext);
  
  const mapViewRef = useRef();

  const centerPosition = async () => {
    const { latitude, longitude } = await getCurrentLocation()
    mapViewRef.current?.animateCamera({
      center: {
          latitude,
          longitude,
          zoom:12
      }
    })
  };

  // Iniciar en posicion iniciar y seguir ubicacion
  useEffect(() => {
    updateStatusDriver();
    centerPosition()
    followUserLocation();
   return () =>{
    // TODO : Cancelar seguimiento al salir de la app
   }
  }, [isOnline])

  // Watch pedidos pendientes de Firestore
  useEffect(() => {
    
      const subscriber = firestore()
      .collection('pedidos')
      .where('status', '==', 'Pendiente')
      .limit(20)
      .onSnapshot(querySnapshot => {
        const pedidosArray = [];
  
        querySnapshot.forEach(documentSnapshot => {
          pedidosArray.push({
            id: documentSnapshot.id,
            date: documentSnapshot.get('date'),
            address: documentSnapshot.get('client').address,
            email: documentSnapshot.get('client').email,
            name: documentSnapshot.get('client').name,
            coordinate: {
              latitude: documentSnapshot.get('client').coordinate.latitude,
              longitude: documentSnapshot.get('client').coordinate.longitude,
            },
          });

        });

        // Orden - Más nuevo al final
        const pedidosOrdenadosByFecha = pedidosArray.sort(
          (objA, objB) => Number(objA.date) - Number(objB.date),
        );
        setPedidos(pedidosOrdenadosByFecha);
        console.log(pedidosOrdenadosByFecha);
      });
    
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    


  }, [isOnline]);

  // Verificar si el pedido aun existe y mostrar sheet
  useEffect(() => {

    if (isOnline === false) {
      setShowNuevoPedido(false);
      setHasPedidoActivo(false);
      setNuevoPedido({});
      return;
    }

    //Consultar si aun existe el pedido en lista // -1 si no encuentra
    let pedidoAunActivoIndex = pedidos.findIndex(pedido => pedido.id === nuevoPedido.id);
    console.log('pedidoAunActivoIndex', pedidoAunActivoIndex);
    if (pedidoAunActivoIndex > 0) {
      setShowNuevoPedido(true);
      setNuevoPedido(pedidos[pedidoAunActivoIndex]);
    }

    // Si aun hay pedidos pendientes, mostrar el ultimo
    if (pedidos.length > 0) {
      setShowNuevoPedido(true);
      setNuevoPedido(pedidos[pedidos.length-1]);
      return;
    }

  }, [pedidos, isOnline])
  
  // Watch de camara sigue al conductor
  useEffect(() => {
    const { latitude, longitude } = locationState.location;
    mapViewRef.current?.animateCamera({
      center: {
          latitude,
          longitude,
          zoom:12
      }
    })

    updateLocationDriver()
  }, [locationState.location])

   //Watch Firestore del pedido activo
   useEffect(() => {

    if (nuevoPedido.id == null) {
      return;
    }

    const subscriber = firestore()
      .collection('pedidos')
      .doc(nuevoPedido.id)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          const statusDelivery = documentSnapshot.get('status');
          console.log('statusDelivery: ', statusDelivery);

          switch (statusDelivery) {
            case 'En Proceso':
              
              break;

            case 'Finalizado':
              Alert.alert('Pedido finalizado', 'El delivery se ha marcado como finalizado el pedido. Gracias por utilizar la app', [ {
                text: 'Aceptar',
                onPress: () => {
                  setShowNuevoPedido(false);
                  setHasPedidoActivo(false);
                  finalizarPedidoDelivery(nuevoPedido.id);
                },
              }]);
              break;
          
            default:
              break;
          }
        }
      });
  
    return () => subscriber();
  }, [nuevoPedido.id])


  // Crea y actualiza el status del conductor en Firestore
  const updateStatusDriver = async () => {
    const { latitude, longitude } = locationState.location;
    const coleccion = firestore().collection('distribuidores');
    coleccion.where('id', '==', user.id).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            if (doc.data()) {
              const documentoRef = firestore().collection('distribuidores').doc(doc.id);
              documentoRef.update({
                isActivo: isOnline
              });
            }
          });
        }else{
          const coleccion = firestore().collection('distribuidores');
          const geoPoint = new firestore.GeoPoint(locationState.location.latitude, locationState.location.longitude);
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

    const { latitude, longitude } = locationState.location;
    // Obtiene una referencia a la colección
    const coleccion = firestore().collection('distribuidores');
    // Realiza la consulta para buscar documentos que coincidan con el campo y valor especificados
    coleccion.where('id', '==', user.id).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            // doc.data() contiene los datos del documento encontrado
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

  const updatePedidoDelivery = async (pedidoID) => {
    const nuevoPedido = await firestore().collection('pedidos').doc(pedidoID).update({
      status: 'En Proceso',
      delivery: {
        name: user.name,
        email: user.email,
        address: locationState.address,
        coordinate: new firestore.GeoPoint(locationState.location.latitude, locationState.location.longitude),
      }
    }).then(() => {
      console.log('Pedido updated!');
    });
  }

  const finalizarPedidoDelivery = async (pedidoID) => {
    await firestore().collection('pedidos').doc(pedidoID).update({
      status: 'Finalizado'
    }).then(() => {
      console.log('Pedido finalizado!');
    });
  }

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
          { showNuevoPedido && requestInfoSheet()} 
          { locationState.hasPedidoActivo && passengerInfoSheet()} 

        </View>
     
      {exitInfo()}
    </View>
  );

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
                onPress={async () => {
                  await setIsOnline(!isOnline);
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
                  {isOnline ? 'Estás Online' : 'Estás Offline'}
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

  function requestInfoSheet() {
    return (
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        duration={1500}
        style={{
          ...styles.bottomSheetWrapStyle
        }}>
        {indicator()}
        {passengerInfo()}
        {acceptRejectAndMoreLessButton()}
      </Animatable.View>
    );
  }


  function passengerInfo() {
    return (
      <View style={{marginTop: Sizes.fixPadding}}>
        {passengerImageWithCallAndMessage()}
        {passengerDetail()}
      </View>
    );
  }

  function passengerInfoSheet() {
    return (
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        duration={1500}
        style={{...styles.bottomSheetWrapStyle}}>
        {indicator()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {passengerInfo()}
        </ScrollView>
        {finalizarPedidoButton()}
      </Animatable.View>
    );
  }

  function indicator() {
    return <View style={{...styles.sheetIndicatorStyle}} />;
  }

  function finalizarPedidoButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setShowNuevoPedido(false);
          setHasPedidoActivo(false);
          finalizarPedidoDelivery(nuevoPedido.id);
        }}
        style={styles.buttonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Finalizar Pedido</Text>
      </TouchableOpacity>
    );
  }

  function acceptRejectAndMoreLessButton() {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsOnline(true);
            setShowNuevoPedido(false); // Ocultamos el sheet de aceptar pedido
            setHasPedidoActivo(true);
            
            updatePedidoDelivery(nuevoPedido.id);
            console.log('nuevoPedido.id', nuevoPedido.id);
          }}
          style={styles.buttonStyle}>
          <Text style={{...Fonts.whiteColor18Bold}}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowNuevoPedido(false);
            setNuevoPedido({});
          }}
          style={{
            ...styles.buttonCancelStyle
          }}>
          <Text style={{...Fonts.whiteColor18Bold}}>Rechazar</Text>
        </TouchableOpacity>
        
      </View>
    );
  }

  function passengerImageWithCallAndMessage() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/images/users/nouser.png')}
          style={styles.passengerImageStyle}
        />
      </View>
    );
  }

  function passengerDetail() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding
        }}>
        <Text style={{textAlign: 'center', ...Fonts.blackColor17SemiBold}}>
          { nuevoPedido?.address }
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
        
          <View
            style={{
              maxWidth: screenWidth / 1.5,
              marginHorizontal: Sizes.fixPadding + 9.0,
              alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={{...Fonts.grayColor14Regular}}>
              Dirección
            </Text>
            <Text numberOfLines={1} style={{...Fonts.blackColor15SemiBold}}>
            { nuevoPedido?.name }
            </Text>
            <Text numberOfLines={1} style={{...Fonts.blackColor15SemiBold}}>
            ID: { nuevoPedido?.id }
            </Text>
          </View>
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
          minZoomLevel={13}
          zoomControlEnabled={true}
          showsUserLocation={true}
          region={{
            latitude: locationState.location.latitude,
            longitude: locationState.location.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          style={{height: '100%'}}
          provider={PROVIDER_GOOGLE}>
          {pedidos.map((item, index) => (
            <Marker key={`${index}`} coordinate={ item.coordinate }
              title='Pedido de Gas'
              description='Hay un pedido pendiente en este sector'
              >
              <Image
                source={require('../../assets/images/icons/marker2.png')}
                style={{
                  
                  resizeMode: 'contain'
                }}
              />
            </Marker>
          ))}
          <Marker
            draggable={true}
            coordinate={locationState.location}
            title='Tu ubicación actual'
            description='No es correcta? Activa el GPS'
          ></Marker>
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
  bottomSheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.5,
    borderTopRightRadius: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.whiteColor,
    position: 'absolute',
    left: 0.0,
    right: 0.0,
    bottom: 0.0,
    maxHeight: screenHeight / 2.4,
  },
  buttonStyle: {
    flex: 1,
    marginTop: Sizes.fixPadding * 3.0,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 2.0,
    borderColor: Colors.whiteColor,
  },
  buttonCancelStyle: {
    flex: 1,
    marginTop: Sizes.fixPadding * 3.0,
    backgroundColor: Colors.redDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 2.0,
    borderColor: Colors.whiteColor,
  },
  sheetIndicatorStyle: {
    width: 50,
    height: 5.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignSelf: 'center',
    marginVertical: Sizes.fixPadding * 2.0,
  },
  callAndMessageIconWrapStyle: {
    width: screenWidth / 10.0,
    height: screenWidth / 10.0,
    borderRadius: screenWidth / 10.0 / 2.0,
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow
  },
  passengerImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
});
