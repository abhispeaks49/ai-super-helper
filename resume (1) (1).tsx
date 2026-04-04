import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FileText, ArrowLeft, Download } from 'lucide-react-native';
import { useAdCounter } from '@/hooks/useAdCounter';

export default function ResumeBuilderScreen() {
  const router = useRouter();
  const { incrementAction, showInterstitialAd } = useAdCounter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);

  const generateResume = async () => {
    if (!name || !email || !skills) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'resume',
          data: { name, email, phone, skills, education, experience },
        }),
      });

      const data = await response.json();
      setResume(data.response || 'Error generating resume');
      incrementAction();
      showInterstitialAd();
    } catch (error) {
      setResume('Error generating resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <FileText size={24} color="#fff" strokeWidth={2} />
        <Text style={styles.headerTitle}>Resume Builder</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 234 567 8900"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Skills *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={skills}
              onChangeText={setSkills}
              placeholder="JavaScript, React, Node.js, etc."
              placeholderTextColor="#666"
              multiline
            />

            <Text style={styles.label}>Education</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={education}
              onChangeText={setEducation}
              placeholder="Bachelor of Computer Science, MIT, 2020"
              placeholderTextColor="#666"
              multiline
            />

            <Text style={styles.label}>Experience</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={experience}
              onChangeText={setExperience}
              placeholder="Software Developer at Google, 2020-2023"
              placeholderTextColor="#666"
              multiline
            />

            <TouchableOpacity
              onPress={generateResume}
              disabled={!name || !email || !skills || loading}
              activeOpacity={0.8}>
              <LinearGradient
                colors={name && email && skills ? ['#667eea', '#764ba2'] : ['#333', '#333']}
                style={styles.generateButton}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Download size={20} color="#fff" />
                    <Text style={styles.generateButtonText}>Generate Resume</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {resume && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Your Resume</Text>
                <View style={styles.resumeBox}>
                  <Text style={styles.resumeText}>{resume}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 8,
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
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    marginTop: 24,
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
  resumeBox: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  resumeText: {
    color: '#fff',
    fontSize: 14,
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
