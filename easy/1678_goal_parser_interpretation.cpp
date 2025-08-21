class Solution {
public:
    string interpret(string command) {
        int len=command.length();
        string s;
        for(int i=0;i<len;i++){
            if(command.at(i)=='('){
                if(command.at(i+1)==')')
                s+="o";
            else if(command.at(i+1)=='a'){
            s+="al";
            i+=3;
            }
            continue;
        }
        else if(command.at(i)==')')
        continue;
        else
        s+=command[i];
    }
    return s;
    }
};