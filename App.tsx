import React, {useEffect, useRef, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Platform, TouchableOpacity } from 'react-native';

type Lap = {
  id: string; // key for deletetion
  time: number;
}
export default function App() {
  //states
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); //interval ID for clearing
  const startTimeRef = useRef<number>(0); // records last start
  const accumulatedRef = useRef<number>(0); // records time passed before last

  //timer
  useEffect(() =>{
    if(isRunning){
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTime(accumulatedRef.current + (Date.now() - startTimeRef.current));
      }, 10);
    } else{
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  //time format
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(
      2, "0"
    )}:${String(ms).padStart(2,"0")}`;
  };

  //start, pause, stop functionality
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    accumulatedRef.current = 0;
  };

  //Lap Functionality 
  const handleLap = () => {
    if(!isRunning && time === 0) return;

    const newLap: Lap ={
      id: Date.now().toString(),
      time: time
    };
    setLaps((prev) => [newLap, ...prev]);
  };

  const handleClearLaps = () => setLaps([]);
  
  const handleRemoveLap = (id: string) => {
    setLaps((prev) => prev.filter((lap) => lap.id !== id));
  };


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
