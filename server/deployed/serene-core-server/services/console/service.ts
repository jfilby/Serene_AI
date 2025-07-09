import * as readline from 'node:readline/promises'
import { stdin as input, stdout } from 'node:process'

export class ConsoleService {
  private rl = readline.createInterface({ input })

  async askQuestion(query: string): Promise<string> {

    stdout.write(query)
    const answer = await this.rl.question('')
    this.rl.close()
    return answer
  }
}
