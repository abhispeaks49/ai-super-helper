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
import { Building2, ArrowLeft, Lightbulb } from 'lucide-react-native';
import { useAdCounter } from '@/hooks/useAdCounter';

export default function BusinessNameScreen() {
  const router = useRouter();
  const { incrementAction, showInterstitialAd } = useAdCounter();
  const [businessType, setBusinessType] = useState('');
  const [keywords, setKeywords] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateNames = async () => {
    if (!businessType.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'business',
          data: { businessType: businessType.trim(), keywords: keywords.trim() },
        }),
      });

      const data = await response.json();
      setNames(data.names || ['Error generating names']);
      incrementAction();
      showInterstitialAd();
    } catch (error) {
      setNames(['Error generating names. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#fa709a', '#fee140']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Building2 size={24} color="#fff" strokeWidth={2} />
        <Text style={styles.headerTitle}>Business Names</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.label}>Business Type *</Text>
          <TextInput
            style={styles.input}
            value={businessType}
            onChangeText={setBusinessType}
            placeholder="Restaurant, Tech Startup, Clothing Store, etc."
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Keywords (Optional)</Text>
          <TextInput
            style={styles.input}
            value={keywords}
            onChangeText={setKeywords}
            placeholder="Modern, Eco-friendly, Premium, etc."
            placeholderTextColor="#666"
          />

          <TouchableOpacity
            onPress={generateNames}
            disabled={!businessType.trim() || loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={businessType.trim() ? ['#667eea', '#764ba2'] : ['#333', '#333']}
              style={styles.generateButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Lightbulb size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Names</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {names.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Name Ideas</Text>
              {names.map((name, index) => (
                <LinearGradient
                  key={index}
                  colors={['#1f2937', '#2a2a3e']}
                  style={styles.nameCard}>
                  <View style={styles.nameNumber}>
                    <Text style={styles.nameNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.nameText}>{name}</Text>
                </LinearGradient>
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
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  generateButton: {
    marginTop: 8,
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
  nameCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  nameNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  nameText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
