import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import RNBluetoothClassic, {
  BluetoothDevice
} from "react-native-bluetooth-classic";
import { BluetoothEventSubscription } from "react-native-bluetooth-classic/lib/BluetoothEvent";

export default function App() {
  const [devices, setDevices] = useState<BluetoothDevice[]>();
  const [device, setDevice] = useState<BluetoothDevice>();
  const [enabledSubscription, setEnabledSubscription] =
    useState<BluetoothEventSubscription>();
  const [disabledSubscription, setDisabledSubscription] =
    useState<BluetoothEventSubscription>();
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>();

  const checkBluetootEnabled = async () => {
    try {
      // console.log(
      //   "Bluetooth enabled: ",
      //   await RNBluetoothClassic.requestBluetoothEnabled()
      // );

      console.log("Checking bluetooth status");
      let enabled = await RNBluetoothClassic.isBluetoothEnabled();

      console.log(`Status: enabled = ${enabled}`);
      setBluetoothEnabled(enabled);

      startDiscovery();
    } catch (error) {
      console.log("Status Error: ", error);
      setBluetoothEnabled(false);
    }
  };

  const writeToDevice = async (jsonData: string) => {
    try {
      console.log(device.name);
      const message = JSON.stringify(jsonData);
      const treatedMessage = message.substring(1, message.length - 1);
      console.log("Message: ", treatedMessage);
      const sent = await device.write(treatedMessage);
      console.log("Data sent:", sent);
    } catch (error) {
      console.log(error);
    }
  };

  const connectToDevice = (device: BluetoothDevice) => async () => {
    try {
      console.log("Trying connection.", device.name, device.address);
      const connected = await device.connect();
      console.log("Connected to device: ", connected);
      setDevice(device);
    } catch (error) {
      console.log(error);
    }
  };

  const startDiscovery = async () => {
    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      RNBluetoothClassic.cancelDiscovery();
      setDevices(devices);
    } catch (error) {
      console.log("Discovery Error: ", error);
      setBluetoothEnabled(false);
    }
  };

  const onStateChanged = (stateChangedEvent) => {
    console.log("Event used for onBluetoothEnabled and onBluetoothDisabled");
    // setState({
    //   bluetoothEnabled: stateChangedEvent.enabled,
    //   device: stateChangedEvent.enabled ? state.device : undefined,
    // });
  };

  useEffect(() => {
    // setEnabledSubscription(
    //   RNBluetoothClassic.onBluetoothEnabled((event) => onStateChanged(event))
    // );
    // setDisabledSubscription(
    //   RNBluetoothClassic.onBluetoothDisabled((event) => onStateChanged(event))
    // );

    checkBluetootEnabled();

    return () => {
      // console.log(
      //   "App:componentWillUnmount removing subscriptions: enabled and distabled"
      // );
      // console.log(
      //   "App:componentWillUnmount alternatively could have used stateChanged"
      // );
      // enabledSubscription.remove();
      // disabledSubscription.remove();
    };
  }, []);

  return (
    <View>
      <Text>Dispositivos:</Text>
      {devices &&
        devices.map((device) => (
          <Button
            key={device.address}
            onPress={connectToDevice(device)}
            title={`${device.name} ${device.address}`}
          />
        ))}
      <Button
        onPress={() => {
          const data = JSON.stringify({ velocidade: 32, direcao: 90 });
          writeToDevice(data);
        }}
        title={"Send data"}
      />
    </View>
  );
}
