import { StatusBar } from "expo-status-bar";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import {
  query,
  orderBy,
  addDoc,
  getDocs,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const todosCollection = collection(db, "todos");
  const toggleTodoCompletion = async (id: string) => {
    const todoDoc = todos.find((todo) => todo.id === id);

    if (!todoDoc) {
      Alert.alert("Error", "Todo not found");
      return;
    }

    try {
      const todoRef = doc(db, "todos", id);

      await updateDoc(todoRef, {
        completed: !todoDoc.completed,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update todo");
      console.error("Error updating todo:", error);
    }
  };
  const deleteTodo = async (id: string) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
    } catch (error) {
      Alert.alert("Error", "Failed to delete todo");
      console.error("Error deleting todo:", error);
    }
  };
  useEffect(() => {
    const q = query(todosCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setTodos(todosData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching todos:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);
  const createTodo = async () => {
    if (inputText.trim() === "") {
      Alert.alert("Error", "Please enter a todo");
      return;
    }
    try {
      await addDoc(todosCollection, {
        text: inputText.trim(),
        completed: false,
        createdAt: Timestamp.now(),
      });
      setInputText("");
    } catch (error) {
      Alert.alert("Error", "Failed to create todo");
      console.error("Error creating todo:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Todo List </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={createTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={createTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text>Todos:</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : todos.length === 0 ? (
        <Text style={styles.noTodosText}>No todos found</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                backgroundColor: "lightgray",
                flex: 1,
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{item.text}</Text>
                {/* <Text>{item.createdAt.toDate().toLocaleString()}</Text> */}

                <Text
                  style={{
                    color: item.completed ? "green" : "red",
                    paddingVertical: 1,
                    borderRadius: 19,
                    backgroundColor: item.completed
                      ? "lightgreen"
                      : "lightcoral",
                    textAlign: "center",
                    width: 120,
                  }}
                >
                  {item.completed ? "Completed" : "Not Completed"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
                  {item.createdAt instanceof Timestamp
                    ? item.createdAt.toDate().toLocaleString()
                    : "Unknown"}
                </Text>
                {item.completed ? (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      backgroundColor: "red",
                      borderRadius: 5,
                      marginTop: 5,
                      paddingHorizontal: 10,
                    }}
                    onPress={() => deleteTodo(item.id)}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      backgroundColor: "lightblue",
                      borderRadius: 5,
                      marginTop: 5,
                      paddingHorizontal: 10,
                    }}
                    onPress={() => toggleTodoCompletion(item.id)}
                  >
                    <Text>Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 50,
    // justifyContent: "center",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  noTodosText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
