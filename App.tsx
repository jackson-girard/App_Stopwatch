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
  const handleRemoveLap = (id: string) => setLaps((prev) => prev.filter((lap) => lap.id !== id));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopwatch</Text>

      <View style={styles.timerCard}>
        <Text style={styles.timer}>{formatTime(time)}</Text>
      </View>

      <View style={styles.buttonRow}>
        {!isRunning ? (
          <Button label="Start" onPress={handleStart} color="#4CAF50" />
        ) : (
          <Button label="Pause" onPress={handlePause} color="#FFC107" />
        )}
        <Button label="Stop" onPress={handleStop} color="#F44336" disabled={!isRunning && time === 0} />
      </View>

      <View style={styles.buttonRow}>
        <Button label="Lap" onPress={handleLap} color="#2196F3" disabled={!isRunning && time === 0}/>
        <Button label="Clear Laps" onPress={handleClearLaps} color="#555" disabled={laps.length === 0}/>
      </View>

      <FlatList
        data={laps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 40}}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No Laps</Text>
            <Text style={styles.emptySubtext}>Tap Lab to Record Time</Text>
          </View>
        }
        renderItem={({item, index}) => (
          <View style={styles.lapItem}>
            <Text style={styles.lapLabel}>Lap {laps.length - index}</Text>
            <Text style={styles.lapTime}>{formatTime(item.time)}</Text>
            <TouchableOpacity onPress={() => handleRemoveLap(item.id)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={styles.deleteBtn}>
              <Text style={styles.deleteText}>x</Text>
            </TouchableOpacity>
          </View>
        )}>    
      </FlatList>
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  color: string;
  disabled?:boolean;
};

const Button = ({label, onPress, color, disabled = false}: ButtonProps) => (
  <TouchableOpacity
    style={[styles.button, {backgroundColor:color}, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.75}
  > 
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "ios" ? 60 : 40
  },
  title: {
    fontSize: 22, 
    fontWeight: "700",
    color: "#666",
    textAlign:"center",
    letterSpacing: 6,
    textTransform: "uppercase",
    marginBottom: 24
  },
  timerCard: {
    backgroundColor: "1A1A1A",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems:"center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a"
  },
  timer: {
    fontSize: 56,
    color: "#00E5FF",
    fontVariant: ["tabular-nums"],
    fontWeight: "200",
    letterSpacing: 2
  },
  buttonRow : {
    flexDirection: "row",
    marginBottom: 12,
    gap: 10
  },
  button: {
    flex: 1,
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: "center"
  },
  buttonDisabled: {opacity: 0.3},
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  lapItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8
  },
  lapLabel: {
    flex: 1, 
    color: "#aaa",
    fontSize: 15
  },
  lapTime: {
    color:"white",
    fontSize: 17,
    fontVariant: ["tabular-nums"],
    fontWeight: "300",
    marginRight: 12
  },
  deleteBtn: {
    width: 28, 
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center"
  },
  deleteText: {
    color: "#666",
    fontSize: 12, 
    fontWeight: "700"
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    opacity: 0.35
  },
  emptyText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4
  },
  emptySubtext: {
    color: "#555",
    fontSize: 12
  }

});
