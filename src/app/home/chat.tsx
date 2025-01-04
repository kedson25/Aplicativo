import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, doc, setDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState({});
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const q = query(collection(db, 'chats'), where('userIds', 'array-contains', user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chats = [];
                querySnapshot.forEach((doc) => {
                    chats.push({ ...doc.data(), id: doc.id });
                });
                setChats(chats);
            });

            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (selectedChat) {
            const q = query(collection(db, 'chats', selectedChat, 'messages'), orderBy('timestamp', 'asc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages = [];
                querySnapshot.forEach((doc) => {
                    messages.push({ ...doc.data(), id: doc.id });
                });
                setMessages(messages);
            });

            return () => unsubscribe();
        }
    }, [selectedChat]);

    useEffect(() => {
        const usersUnsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
            const users = {};
            querySnapshot.forEach((doc) => {
                users[doc.id] = doc.data();
            });
            setUsers(users);
        });

        return () => usersUnsubscribe();
    }, []);

    const handleSend = async () => {
        if (message.trim() === '') return;

        try {
            const user = auth.currentUser;
            if (user && selectedChat) {
                await addDoc(collection(db, 'chats', selectedChat, 'messages'), {
                    text: message,
                    userId: user.uid,
                    timestamp: new Date(),
                });
                setMessage('');
            } else {
                console.log('Usuário não autenticado ou chat não selecionado');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const handleSearch = async () => {
        if (search.trim() === '') return;

        try {
            const q = query(collection(db, 'users'), where('name', '==', search));
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });
            setSearchResults(results);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const startChat = async (userId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const chatId = [user.uid, userId].sort().join('_');
                const chatDocRef = doc(db, 'chats', chatId);
                await setDoc(chatDocRef, {
                    userIds: [user.uid, userId],
                }, { merge: true });
                setSelectedChat(chatId);
            }
        } catch (error) {
            console.error('Erro ao iniciar chat:', error);
        }
    };

    const renderItem = ({ item }) => {
        const user = users[item.userId];
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.userName}>{user ? user.name : 'Desconhecido'}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    const renderSearchResult = ({ item }) => (
        <Pressable style={styles.searchResult} onPress={() => startChat(item.id)}>
            <Text style={styles.userName}>{item.name}</Text>
        </Pressable>
    );

    const renderChat = ({ item }) => {
        const otherUserId = item.userIds.find(id => id !== auth.currentUser.uid);
        const otherUser = users[otherUserId];
        return (
            <Pressable style={styles.chatItem} onPress={() => setSelectedChat(item.id)}>
                <Text style={styles.userName}>{otherUser ? otherUser.name : 'Desconhecido'}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Pesquisar usuário..."
                    placeholderTextColor={Colors.darkGray}
                    style={styles.input}
                />
                <Pressable style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Pesquisar</Text>
                </Pressable>
            </View>
            <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                style={styles.searchResultsList}
            />
            <FlatList
                data={chats}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
            />
            {selectedChat && (
                <>
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.messageList}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor={Colors.darkGray}
                            style={styles.input}
                        />
                        <Pressable style={styles.button} onPress={handleSend}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.zinc,
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchResultsList: {
        marginBottom: 10,
    },
    searchResult: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginVertical: 5,
    },
    chatList: {
        marginBottom: 10,
    },
    chatItem: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginVertical: 5,
    },
    messageList: {
        flex: 1,
    },
    messageContainer: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginVertical: 5,
    },
    userName: {
        fontWeight: 'bold',
        color: Colors.black,
    },
    messageText: {
        color: Colors.black,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 8,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.darkGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors.black,
        backgroundColor: Colors.white,
    },
    button: {
        backgroundColor: Colors.purple,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginLeft: 10,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Chat;