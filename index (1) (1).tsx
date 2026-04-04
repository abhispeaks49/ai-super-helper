import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, FileText, Hash, BookOpen, Building2, Sprout } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      id: 'chat',
      title: 'AI Chat Assistant',
      description: 'Chat with AI like ChatGPT',
      icon: MessageCircle,
      colors: ['#667eea', '#764ba2'],
      route: '/chat',
    },
    {
      id: 'resume',
      title: 'Resume Builder',
      description: 'Create professional resumes',
      icon: FileText,
      colors: ['#f093fb', '#f5576c'],
      route: '/resume',
    },
    {
      id: 'caption',
      title: 'Caption Generator',
      description: 'Instagram captions & quotes',
      icon: Hash,
      colors: ['#4facfe', '#00f2fe'],
      route: '/caption',
    },
    {
      id: 'homework',
      title: 'Homework Helper',
      description: 'Get help with assignments',
      icon: BookOpen,
      colors: ['#43e97b', '#38f9d7'],
      route: '/homework',
    },
    {
      id: 'business',
      title: 'Business Names',
      description: 'Generate business name ideas',
      icon: Building2,
      colors: ['#fa709a', '#fee140'],
      route: '/business',
    },
    {
      id: 'farming',
      title: 'Farming Tips',
      description: 'Agricultural guidance & tips',
      icon: Sprout,
      colors: ['#30cfd0', '#330867'],
      route: '/farming',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.header}>
        <Text style={styles.headerTitle}>AI Super Helper</Text>
        <Text style={styles.headerSubtitle}>2026 Edition</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Choose Your Tool</Text>

        <View style={styles.grid}>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <TouchableOpacity
                key={feature.id}
                style={styles.cardWrapper}
                onPress={() => router.push(feature.route as any)}
                activeOpacity={0.8}>
                <LinearGradient colors={feature.colors} style={styles.card}>
                  <View style={styles.iconContainer}>
                    <IconComponent size={32} color="#fff" strokeWidth={2} />
                  </View>
                  <Text style={styles.cardTitle}>{feature.title}</Text>
                  <Text style={styles.cardDescription}>{feature.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: (width - 36) / 2,
    padding: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 160,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
