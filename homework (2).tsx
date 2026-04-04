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
import { BookOpen, ArrowLeft, Brain } from 'lucide-react-native';
import { useAdCounter } from '@/hooks/useAdCounter';

export default function HomeworkHelperScreen() {
  const router = useRouter();
  const { incrementAction, showInterstitialAd } = useAdCounter();
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'Other'];

  const getHelp = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'homework',
          data: { question: question.trim(), subject },
        }),
      });

      const data = await response.json();
      setAnswer(data.response || 'Error getting help');
      incrementAction();
      showInterstitialAd();
    } catch (error) {
      setAnswer('Error getting help. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <BookOpen size={24} color="#fff" strokeWidth={2} />
        <Text style={styles.headerTitle}>Homework Helper</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.label}>Subject (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsScroll}>
            {subjects.map((sub) => (
              <TouchableOpacity
                key={sub}
                onPress={() => setSubject(sub === subject ? '' : sub)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={
                    subject === sub
                      ? ['#667eea', '#764ba2']
                      : ['#1f2937', '#1f2937']
                  }
                  style={styles.subjectButton}>
                  <Text style={styles.subjectLabel}>{sub}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Your Question</Text>
          <TextInput
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            placeholder="What is the Pythagorean theorem?"
            placeholderTextColor="#666"
            multiline
          />

          <TouchableOpacity
            onPress={getHelp}
            disabled={!question.trim() || loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={question.trim() ? ['#667eea', '#764ba2'] : ['#333', '#333']}
              style={styles.generateButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Brain size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Get Help</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {answer && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Explanation</Text>
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{answer}</Text>
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
  subjectsScroll: {
    marginBottom: 24,
  },
  subjectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  subjectLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
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
  resultContainer: {
    marginTop: 32,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  answerBox: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  answerText: {
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
