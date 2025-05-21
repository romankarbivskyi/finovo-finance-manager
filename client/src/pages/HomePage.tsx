import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useModalStore } from "@/stores/modalStore";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PiggyBank,
  Target,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Manage Your Money <span className="text-primary">Smarter</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Take control of your finances with our simple, powerful goal
            tracking tool.
          </p>
        </div>

        <div className="grid w-full gap-8 sm:grid-cols-3">
          <FeatureCard
            icon={<Target />}
            title="Track Goals"
            description="Set financial goals and track your progress over time"
          />
          <FeatureCard
            icon={<PiggyBank />}
            title="Save Money"
            description="Visualize your savings and stay motivated to reach your targets"
          />
          <FeatureCard
            icon={<Wallet />}
            title="Multi-Currency"
            description="Manage finances in different currencies with easy conversion"
          />
        </div>

        <div className="bg-muted w-full rounded-lg p-6 text-center">
          <p className="text-lg font-medium">
            "I finally have all my savings goals in one place. Highly
            recommended!"
          </p>
          <p className="text-muted-foreground mt-2">— Jane Smith</p>
        </div>

        <section
          id="about"
          className="to-muted/20 relative w-full rounded-xl bg-gradient-to-br from-transparent py-8"
        >
          <div className="bg-primary/5 absolute -top-8 -right-8 h-40 w-40 rounded-full opacity-70 blur-3xl"></div>
          <div className="bg-primary/10 absolute bottom-4 -left-12 h-32 w-32 rounded-full opacity-50 blur-3xl"></div>

          <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Mission
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative flex flex-col gap-5 text-left">
              <div className="from-primary/30 absolute top-0 -left-5 h-full w-1 rounded-full bg-gradient-to-b to-transparent"></div>
              <h3 className="text-primary text-xl font-semibold tracking-tight">
                Simplifying Financial Success
              </h3>
              <p className="text-foreground/90">
                Finance Manager was born from a vision to transform how people
                interact with their financial goals, making the journey toward
                financial freedom both intuitive and rewarding.
              </p>
              <p>
                Our platform empowers you to visualize progress, celebrate
                milestones, and stay motivated throughout your financial
                journey. From vacations to retirement, we've designed powerful
                yet simple tools to support every financial aspiration.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-primary/80 font-medium">Trusted by</span>
                <div className="flex items-center gap-1">
                  <div className="bg-primary/20 h-7 w-7 rounded-full"></div>
                  <div className="bg-primary/30 -ml-2 h-7 w-7 rounded-full"></div>
                  <div className="bg-primary/40 -ml-2 h-7 w-7 rounded-full"></div>
                  <span className="ml-2 text-sm font-medium">
                    12,000+ users worldwide
                  </span>
                </div>
              </div>
            </div>

            <div className="border-border/50 bg-card/50 rounded-xl border p-6 shadow-sm backdrop-blur-sm">
              <h3 className="mb-5 text-xl font-semibold">Why Choose Us</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="bg-background/50 flex flex-col gap-2 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <PiggyBank className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Smart Budgeting</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Track spending patterns and save efficiently
                  </p>
                </li>
                <li className="bg-background/50 flex flex-col gap-2 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Target className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Goal Tracking</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Visualize progress toward every financial milestone
                  </p>
                </li>
                <li className="bg-background/50 flex flex-col gap-2 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Multi-Currency</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Manage finances across different currencies seamlessly
                  </p>
                </li>
                <li className="bg-background/50 flex flex-col gap-2 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Secure Platform</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Enterprise-grade security protecting your data
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full">
          <h2 className="mb-6 text-3xl font-bold">Contact Us</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Get in Touch</h3>
                  <p className="text-muted-foreground">
                    Have questions or feedback? We'd love to hear from you.
                  </p>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="text-primary h-5 w-5" />
                      <span>support@financemanager.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-primary h-5 w-5" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary h-5 w-5" />
                      <span>123 Financial Street, Money City</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Quick Message</h3>
                  <p className="text-muted-foreground">
                    Send us a message and we'll get back to you soon.
                  </p>
                  <div className="flex items-center justify-center p-6">
                    <Button
                      className="gap-2"
                      onClick={() => {
                        window.location.href =
                          "mailto:support@financemanager.com";
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-2">
          <Button
            size="lg"
            onClick={() =>
              isAuthenticated ? navigate("/dashboard") : openModal("auth")
            }
          >
            Start Your Financial Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="text-primary bg-primary/10 rounded-full p-3">{icon}</div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

export default HomePage;
