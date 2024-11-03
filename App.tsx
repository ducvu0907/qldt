import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, FlatList } from 'react-native';
import "./global.css";
import { useState } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

export type Post = {
  userId: number
  id: number
  title: string
  body: string
};

const queryClient = new QueryClient();

const fetchData = async (): Promise<Post[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return res.data;
};

const PostsList = () => {
  const postsQuery = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchData
  });

  if (postsQuery.isLoading) {
    return <Text>Loading...</Text>
  }

  if (postsQuery.isError) {
    return <Text>Error...</Text>
  }

  return (
    <FlatList
      data={postsQuery.data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text className="font-bold">{item.title}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
    />
  );
};

export default function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <QueryClientProvider client={queryClient}>
      <View className="h-full flex justify-center">
        <Text className="font-bold italic">Test Native Wind</Text>
        <Button title="Increment" onPress={() => setCount(prev => prev + 1)} />
        <Text>Count: {count}</Text>
        <PostsList />
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}