import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FileText, Hash, BookOpen, Building2, Sprout, Wrench } from 'lucide-react-native';

export default function ToolsScreen() {
  const router = useRouter();

  const tools = [
    {
      id: 'resume',
      title: 'Resume Builder',
      description: 'Create professional resumes instantly',
      icon: FileText,
      colors: ['#f093fb', '#f5576c'],
      route: '/resume',
    },
    {
      id: 'caption',
      title: 'Caption Generator',
      description: 'Generate Instagram captions',
      icon: Hash,
      colors: ['#4facfe', '#00f2fe'],
      route: '/caption',
    },
    {
      id: 'homework',
      title: 'Homework Helper',
      description: 'Get help with your studies',
      icon: BookOpen,
      colors: ['#43e97b', '#38f9d7'],
      route: '/homework',
    },
    {
      id: 'business',
      title: 'Business Name Generator',
      description: 'Create unique business names',
      icon: Building2,
      colors: ['#fa709a', '#fee140'],
      route: '/business',
    },
    {
      id: 'farming',
      title: 'Farming Tips',
      description: 'Get agricultural guidance',
      icon: Sprout,
      colors: ['#30cfd0', '#330867'],
      route: '/farming',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.header}>
        <Wrench size={24} color="#00d4ff" strokeWidth={2} />
        <Text style={styles.headerTitle}>All Tools</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <TouchableOpacity
              key={tool.id}
              onPress={() => router.push(tool.route as any)}
              activeOpacity={0.8}>
              <LinearGradient colors={tool.colors} style={styles.toolCard}>
                <View style={styles.iconContainer}>
                  <IconComponent size={28} color="#fff" strokeWidth={2} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  toolCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomPadding: {
    height: 80,
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
