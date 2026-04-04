import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Hash, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAdCounter } from '@/hooks/useAdCounter';

export default function CaptionGeneratorScreen() {
  const router = useRouter();
  const { incrementAction, showInterstitialAd } = useAdCounter();
  const [topic, setTopic] = useState('');
  const [selectedType, setSelectedType] = useState<'funny' | 'attitude' | 'love' | 'motivational'>('funny');
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const types = [
    { id: 'funny', label: 'Funny', emoji: '😂' },
    { id: 'attitude', label: 'Attitude', emoji: '😎' },
    { id: 'love', label: 'Love', emoji: '❤️' },
    { id: 'motivational', label: 'Motivational', emoji: '💪' },
  ];

  const generateCaptions = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'caption',
          data: { topic: topic.trim(), captionType: selectedType },
        }),
      });

      const data = await response.json();
      setCaptions(data.captions || ['Error generating captions']);
      incrementAction();
      showInterstitialAd();
    } catch (error) {
      setCaptions(['Error generating captions. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Hash size={24} color="#fff" strokeWidth={2} />
        <Text style={styles.headerTitle}>Caption Generator</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.label}>What's your post about?</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Beach vacation, fitness, food, etc."
            placeholderTextColor="#666"
            multiline
          />

          <Text style={styles.label}>Caption Style</Text>
          <View style={styles.typesContainer}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id as any)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={
                    selectedType === type.id
                      ? ['#667eea', '#764ba2']
                      : ['#1f2937', '#1f2937']
                  }
                  style={styles.typeButton}>
                  <Text style={styles.typeEmoji}>{type.emoji}</Text>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={generateCaptions}
            disabled={!topic.trim() || loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={topic.trim() ? ['#667eea', '#764ba2'] : ['#333', '#333']}
              style={styles.generateButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Sparkles size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Captions</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {captions.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Your Captions</Text>
              {captions.map((caption, index) => (
                <View key={index} style={styles.captionCard}>
                  <Text style={styles.captionNumber}>{index + 1}</Text>
                  <Text style={styles.captionText}>{caption}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.adBanner}>
        <Text style={styles.adText}>Ad Banner Space (AdMob)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeEmoji: {
    fontSize: 18,
  },
  typeLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  generateButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsContainer: {
    marginTop: 32,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  captionCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    gap: 12,
  },
  captionNumber: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '700',
  },
  captionText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 100,
  },
  adBanner: {
    height: 50,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  adText: {
    color: '#666',
    fontSize: 12,
  },
});
