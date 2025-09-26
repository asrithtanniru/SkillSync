import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Video, Coins, Star, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className= "min-h-screen bg-[#F0E9D2]" >
    {/* Header */ }
    < header className = "border-b border-[#E6DDC4] bg-white/80 backdrop-blur-sm sticky top-0 z-50" >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between" >
        <div className="flex items-center space-x-2" >
          <div className="w-8 h-8 bg-[#678983] rounded-lg flex items-center justify-center" >
            <BookOpen className="w-5 h-5 text-white" />
              </div>
              < span className = "text-xl font-bold text-[#181D31]" > SkillSwap </span>
                </div>
                < nav className = "hidden md:flex items-center space-x-6" >
                  <Link href="/explore" className = "text-[#181D31] hover:text-[#678983] transition-colors" >
                    Explore
                    </Link>
                    < Link href = "/dashboard" className = "text-[#181D31] hover:text-[#678983] transition-colors" >
                      Dashboard
                      </Link>
                      < Link href = "/wallet" className = "text-[#181D31] hover:text-[#678983] transition-colors" >
                        Wallet
                        </Link>
                        </nav>
                        < div className = "flex items-center space-x-3" >
                          <Button variant="outline" className = "border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white" >
                            Sign In
                              </Button>
                              < Button className = "bg-[#678983] hover:bg-[#678983]/90 text-white" > Get Started </Button>
                                </div>
                                </div>
                                </header>

  {/* Hero Section */ }
  <section className="py-20 px-4" >
    <div className="container mx-auto text-center max-w-4xl" >
      <h1 className="text-5xl md:text-6xl font-bold text-[#181D31] mb-6 leading-tight" >
        Exchange Skills,
          <br />
          < span className = "text-[#678983]" > Earn Tokens </span>
            </h1>
            < p className = "text-xl text-[#181D31]/70 mb-8 max-w-2xl mx-auto" >
              Connect with learners and teachers worldwide.Share your expertise, learn new skills, and earn blockchain
            tokens for every successful exchange.
          </p>
    < div className = "flex flex-col sm:flex-row gap-4 justify-center" >
      <Button size="lg" className = "bg-[#678983] hover:bg-[#678983]/90 text-white px-8 py-3" >
        Start Learning
          < ArrowRight className = "ml-2 w-5 h-5" />
            </Button>
            < Button
  size = "lg"
  variant = "outline"
  className = "border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white px-8 py-3"
    >
    Become a Teacher
      </Button>
      </div>
      </div>
      </section>

  {/* Features Grid */ }
  <section className="py-16 px-4" >
    <div className="container mx-auto" >
      <h2 className="text-3xl font-bold text-[#181D31] text-center mb-12" > How SkillSwap Works </h2>
        < div className = "grid md:grid-cols-2 lg:grid-cols-4 gap-6" >
          <Card className="bg-white border-[#E6DDC4] hover:shadow-lg transition-shadow" >
            <CardHeader className="text-center" >
              <div className="w-12 h-12 bg-[#678983]/10 rounded-lg flex items-center justify-center mx-auto mb-4" >
                <Users className="w-6 h-6 text-[#678983]" />
                  </div>
                  < CardTitle className = "text-[#181D31]" > Smart Matching </CardTitle>
                    </CardHeader>
                    < CardContent >
                    <CardDescription className="text-center text-[#181D31]/70" >
                      Our AI matches you with perfect skill partners based on what you can teach and want to learn.
                </CardDescription>
                        </CardContent>
                        </Card>

                        < Card className = "bg-white border-[#E6DDC4] hover:shadow-lg transition-shadow" >
                          <CardHeader className="text-center" >
                            <div className="w-12 h-12 bg-[#678983]/10 rounded-lg flex items-center justify-center mx-auto mb-4" >
                              <Video className="w-6 h-6 text-[#678983]" />
                                </div>
                                < CardTitle className = "text-[#181D31]" > Video Learning </CardTitle>
                                  </CardHeader>
                                  < CardContent >
                                  <CardDescription className="text-center text-[#181D31]/70" >
                                    Connect face - to - face with integrated video calls, screen sharing, and interactive sessions.
                </CardDescription>
                                      </CardContent>
                                      </Card>

                                      < Card className = "bg-white border-[#E6DDC4] hover:shadow-lg transition-shadow" >
                                        <CardHeader className="text-center" >
                                          <div className="w-12 h-12 bg-[#678983]/10 rounded-lg flex items-center justify-center mx-auto mb-4" >
                                            <Coins className="w-6 h-6 text-[#678983]" />
                                              </div>
                                              < CardTitle className = "text-[#181D31]" > Earn Tokens </CardTitle>
                                                </CardHeader>
                                                < CardContent >
                                                <CardDescription className="text-center text-[#181D31]/70" >
                                                  Get rewarded with SkillSwap Tokens(SST) for every successful skill exchange you complete.
                </CardDescription>
                                                    </CardContent>
                                                    </Card>

                                                    < Card className = "bg-white border-[#E6DDC4] hover:shadow-lg transition-shadow" >
                                                      <CardHeader className="text-center" >
                                                        <div className="w-12 h-12 bg-[#678983]/10 rounded-lg flex items-center justify-center mx-auto mb-4" >
                                                          <Star className="w-6 h-6 text-[#678983]" />
                                                            </div>
                                                            < CardTitle className = "text-[#181D31]" > Build Reputation </CardTitle>
                                                              </CardHeader>
                                                              < CardContent >
                                                              <CardDescription className="text-center text-[#181D31]/70" >
                                                                Rate and review your learning experiences to build trust and credibility in the community.
                </CardDescription>
                                                                  </CardContent>
                                                                  </Card>
                                                                  </div>
                                                                  </div>
                                                                  </section>

  {/* Popular Skills */ }
  <section className="py-16 px-4 bg-white" >
    <div className="container mx-auto" >
      <h2 className="text-3xl font-bold text-[#181D31] text-center mb-12" > Popular Skills to Learn </h2>
        < div className = "flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" >
        {
          [
            "React Development",
            "Python Programming",
            "UI/UX Design",
            "Digital Marketing",
            "Data Science",
            "Photography",
            "Spanish Language",
            "Guitar Playing",
            "Cooking",
            "Yoga",
            "Public Speaking",
            "Blockchain Development",
            "Content Writing",
            "Video Editing",
            "Machine Learning",
            "Graphic Design",
            ].map((skill) => (
              <Badge
                key= { skill }
                variant = "secondary"
                className = "bg-[#E6DDC4] text-[#181D31] hover:bg-[#678983] hover:text-white cursor-pointer transition-colors px-4 py-2 text-sm"
              >
              { skill }
              </Badge>
            ))
        }
          </div>
          </div>
          </section>

  {/* CTA Section */ }
  <section className="py-20 px-4 bg-[#678983]" >
    <div className="container mx-auto text-center" >
      <h2 className="text-4xl font-bold text-white mb-6" > Ready to Start Your Learning Journey ? </h2>
        < p className = "text-xl text-white/90 mb-8 max-w-2xl mx-auto" >
          Join thousands of learners and teachers already exchanging skills on SkillSwap.
          </p>
            < Button size = "lg" className = "bg-white text-[#678983] hover:bg-white/90 px-8 py-3" >
              Join SkillSwap Today
                < ArrowRight className = "ml-2 w-5 h-5" />
                  </Button>
                  </div>
                  </section>

  {/* Footer */ }
  <footer className="bg-[#181D31] text-white py-12 px-4" >
    <div className="container mx-auto" >
      <div className="grid md:grid-cols-4 gap-8" >
        <div>
        <div className="flex items-center space-x-2 mb-4" >
          <div className="w-8 h-8 bg-[#678983] rounded-lg flex items-center justify-center" >
            <BookOpen className="w-5 h-5 text-white" />
              </div>
              < span className = "text-xl font-bold" > SkillSwap </span>
                </div>
                < p className = "text-white/70" > The future of peer - to - peer learning with blockchain rewards.</p>
                  </div>
                  < div >
                  <h3 className="font-semibold mb-4" > Platform </h3>
                    < ul className = "space-y-2 text-white/70" >
                      <li>
                      <Link href="/explore" className = "hover:text-white transition-colors" >
                        Explore Skills
                          </Link>
                          </li>
                          < li >
                          <Link href="/dashboard" className = "hover:text-white transition-colors" >
                            Dashboard
                            </Link>
                            </li>
                            < li >
                            <Link href="/wallet" className = "hover:text-white transition-colors" >
                              Wallet
                              </Link>
                              </li>
                              </ul>
                              </div>
                              < div >
                              <h3 className="font-semibold mb-4" > Support </h3>
                                < ul className = "space-y-2 text-white/70" >
                                  <li>
                                  <Link href="/help" className = "hover:text-white transition-colors" >
                                    Help Center
                                      </Link>
                                      </li>
                                      < li >
                                      <Link href="/contact" className = "hover:text-white transition-colors" >
                                        Contact Us
                                          </Link>
                                          </li>
                                          < li >
                                          <Link href="/community" className = "hover:text-white transition-colors" >
                                            Community
                                            </Link>
                                            </li>
                                            </ul>
                                            </div>
                                            < div >
                                            <h3 className="font-semibold mb-4" > Legal </h3>
                                              < ul className = "space-y-2 text-white/70" >
                                                <li>
                                                <Link href="/privacy" className = "hover:text-white transition-colors" >
                                                  Privacy Policy
                                                    </Link>
                                                    </li>
                                                    < li >
                                                    <Link href="/terms" className = "hover:text-white transition-colors" >
                                                      Terms of Service
                                                        </Link>
                                                        </li>
                                                        < li >
                                                        <Link href="/cookies" className = "hover:text-white transition-colors" >
                                                          Cookie Policy
                                                            </Link>
                                                            </li>
                                                            </ul>
                                                            </div>
                                                            </div>
                                                            < div className = "border-t border-white/20 mt-8 pt-8 text-center text-white/70" >
                                                              <p>& copy; 2024 SkillSwap.All rights reserved.</p>
                                                                </div>
                                                                </div>
                                                                </footer>
                                                                </div>
  )
}
