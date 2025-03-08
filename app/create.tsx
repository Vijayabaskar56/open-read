import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, ScrollView, TextInput, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";

import { Text } from "@/components/ui/text";
import { useDatabase } from "@/db/provider";
import { habitTable } from "@/db/schema";
import * as rssParser from 'react-native-rss-parser';

const HabitCategories = [
  { value: "health", label: "Health And Wellness" },
  { value: "personal-development", label: "Personal Development" },
  { value: "social-and-relationshipts", label: "Social And Relationships" },
  { value: "productivity", label: "Productivity" },
  { value: "creativity", label: "Creativity" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "financial", label: "Financial" },
  { value: "leisure", label: "Leisure" },
];

const HabitDurations = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

const formSchema = createInsertSchema(habitTable, {
  name: (schema) => schema.name.min(4, {
    message: "Please enter a habit name.",
  }),
  description: (schema) => schema.description.min(1, {
    message: "We need to know.",
  }),
  category: z.object(
    { value: z.string(), label: z.string() },
    {
      invalid_type_error: "Please select a favorite email.",
    },
  ),
  duration: z.union([z.string(), z.number()]),
  enableNotifications: z.boolean(),
});


// TODO: refactor to use UI components

export default function FormScreen() {
  const { db } = useDatabase();
  const router = useRouter();

  const scrollRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // const { addFeed, categories } = useFeedStore();

  const handleAddFeed = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a valid RSS feed URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      const responseData = await response.text();
      const result = await rssParser.parse(responseData);

      const feed: Feed = {
        id: Date.now().toString(),
        title: result.title,
        url,
        category: 'default',
        lastUpdated: new Date().toISOString(),
        items: result.items.map(item => ({
          id: item.id || Date.now().toString(),
          title: item.title,
          description: item.description,
          link: item.links[0]?.url || '',
          published: item.published,
          thumbnail: item.enclosures?.[0]?.url,
          isRead: false,
          isBookmarked: false,
        })),
      };

      // await addFeed(feed);
      setUrl('');
      Alert.alert('Success', 'Feed added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add feed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 5,
      category: { value: "health", label: "Health And Wellness" },
      enableNotifications: false,
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await db?.insert(habitTable).values({
        ...values,
        category: values.category.value,
        duration: Number(values.duration),
      }).returning()
      router.replace("/")
    } catch (e) {
      console.error(e)
    }

  }
  return (
    <ScrollView
      contentContainerClassName="p-6 mx-auto w-full max-w-xl"
      showsVerticalScrollIndicator={true}
      className="bg-background"
      automaticallyAdjustContentInsets={false}
      contentInset={{ top: 12 }}
    >
      <Stack.Screen
        options={{
          title: "New Habit",
          headerShadowVisible: true,
          // headerRight: () => Platform.OS !== "web" && <Pressable onPress={() => router.dismiss()}><X /></Pressable>
        }}
      />
      <View >
        <Text>Feed URL</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Enter RSS feed URL"
          placeholderTextColor={isDark ? '#888888' : '#666666'}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          onPress={handleAddFeed}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text>Add Feed</Text>
          )}
        </Pressable>
        <Button onPress={form.handleSubmit(handleSubmit)}>
          <Text>Submit</Text>
        </Button>
      </View>
    </ScrollView >
  );
}
