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
import { Sprout, ArrowLeft, Leaf } from 'lucide-react-native';
import { useAdCounter } from '@/hooks/useAdCounter';

export default function FarmingTipsScreen() {
  const router = useRouter();
  const { incrementAction, showInterstitialAd } = useAdCounter();
  const [cropName, setCropName] = useState('');
  const [location, setLocation] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const popularCrops = ['Rice', 'Wheat', 'Corn', 'Tomatoes', 'Potatoes', 'Cotton'];

  const getTips = async () => {
    if (!cropName.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'farming',
          data: { crop: cropName.trim(), location: location.trim() },
        }),
      });

      const data = await response.json();
      setTips(data.response || 'Error getting tips');
      incrementAction();
      showInterstitialAd();
    } catch (error) {
      setTips('Error getting tips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#30cfd0', '#330867']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Sprout size={24} color="#fff" strokeWidth={2} />
        <Text style={styles.headerTitle}>Farming Tips</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.label}>Crop Name *</Text>
          <TextInput
            style={styles.input}
            value={cropName}
            onChangeText={setCropName}
            placeholder="Enter crop name (e.g., Wheat, Rice)"
            placeholderTextColor="#666"
          />

          <Text style={styles.quickLabel}>Popular Crops</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropsScroll}>
            {popularCrops.map((crop) => (
              <TouchableOpacity
                key={crop}
                onPress={() => setCropName(crop)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={
                    cropName === crop
                      ? ['#43e97b', '#38f9d7']
                      : ['#1f2937', '#1f2937']
                  }
                  style={styles.cropButton}>
                  <Text style={styles.cropLabel}>{crop}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Location (Optional)</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Your region or climate type"
            placeholderTextColor="#666"
          />

          <TouchableOpacity
            onPress={getTips}
            disabled={!cropName.trim() || loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={cropName.trim() ? ['#667eea', '#764ba2'] : ['#333', '#333']}
              style={styles.generateButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Leaf size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Get Tips</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {tips && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Farming Tips for {cropName}</Text>
              <View style={styles.tipsBox}>
                <Text style={styles.tipsText}>{tips}</Text>
              </View>
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
  quickLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#43e97b',
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  cropsScroll: {
    marginBottom: 16,
  },
  cropButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  cropLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  resultContainer: {
    marginTop: 32,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  tipsBox: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  tipsText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
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
