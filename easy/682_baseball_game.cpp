class Solution {
public:
    int calPoints(vector<string>& ops) {
        stack<int>rec;
        for(int i=0;i<ops.size();i++)
        {
            if(ops[i]=="C")
            {
                rec.pop();
            }
            else if(ops[i]=="D")
            {
                rec.push(2*rec.top());
            }
            else if(ops[i]=="+")
            {
                int temp1=rec.top();
                rec.pop();
                int temp2=rec.top();
            
                rec.push(temp1);
                rec.push(temp1+temp2);
            }
            else
            {
                rec.push(stoi(ops[i]));
            }
        }
        int sum=0;
        while(rec.size()>0)
        {
            sum+=rec.top();
            rec.pop();
        }
        return(sum);
    }
};